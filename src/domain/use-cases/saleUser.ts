import { SaleRepository } from "../repositories/saleRepository";
import { prisma } from "@/config/prismaClient";
import {
  ICreateSaleRequest,
  IAddPaymentRequest,
  ISaleDetailed,
  IPaymentResponse,
} from "../models/ISale";
import { IHttpError } from "../models/IAuth";

export class SaleUser implements SaleRepository {
  
  // --- A. Crear Venta (Con Transacción y Descuento de Stock) ---
  async createSale(data: ICreateSaleRequest): Promise<ISaleDetailed> {
    
    // Iniciamos una transacción para asegurar que Venta y Stock se procesen juntos o fallen juntos
    return await prisma.$transaction(async (tx) => {
      
      let subtotalGeneral = 0;
      let descuentoTotalPesos = 0;
      const detallesParaGuardar = [];

      // 1. Iteramos sobre los productos solicitados
      for (const item of data.productos) {
        
        // A. Obtener presentación para saber precio y equivalencia (peso)
        const presentacion = await tx.presentacion_producto.findUnique({
          where: { presentacion_id: item.presentacion_id },
        });

        if (!presentacion) {
          throw { status: 404, message: `Presentación ID ${item.presentacion_id} no encontrada` };
        }

        if (presentacion.producto_id !== item.producto_id) {
           throw { status: 400, message: `La presentación no coincide con el producto enviado` };
        }

        // B. Calcular cuánto stock real vamos a descontar
        // Ejemplo: Si vendes 2 piezas y cada una pesa 0.5kg, necesitas descontar 1.0kg
        const cantidadADescontar = item.cantidad * presentacion.cantidad_equivalente;

        // C. LOGICA DE STOCK (FIFO)
        // Buscamos lotes de stock con cantidad disponible, ordenados por antigüedad
        const lotesStock = await tx.stock.findMany({
          where: {
            producto_id: item.producto_id,
            sucursal_id: data.sucursal_id,
            cantidad_actual: { gt: 0 }, // Solo lo que tenga existencia
            estado: "ACTIVO"
          },
          orderBy: { created_at: 'asc' } // Usamos primero lo más viejo (PEPS/FIFO)
        });

        let pendienteDeDescontar = cantidadADescontar;

        // Recorremos los lotes para ir restando
        for (const lote of lotesStock) {
          if (pendienteDeDescontar <= 0) break;

          const disponibleEnLote = lote.cantidad_actual ?? 0; // Usar 0 si es null

          if (disponibleEnLote >= pendienteDeDescontar) {
            // Caso 1: El lote alcanza para cubrir todo lo que falta
            const nuevaCantidad = disponibleEnLote - pendienteDeDescontar;
            
            await tx.stock.update({
              where: { stock_id: lote.stock_id },
              data: {
                cantidad_actual: nuevaCantidad,
                estado: nuevaCantidad === 0 ? "AGOTADO" : "ACTIVO" // Si queda en 0, cambiamos estado
              }
            });
            
            pendienteDeDescontar = 0; // Ya terminamos con este producto
          } else {
            // Caso 2: El lote no alcanza, tomamos todo y pasamos al siguiente
            await tx.stock.update({
              where: { stock_id: lote.stock_id },
              data: {
                cantidad_actual: 0,
                estado: "AGOTADO"
              }
            });
            
            pendienteDeDescontar -= disponibleEnLote;
          }
        }

        // Si después de revisar todos los lotes aún falta por descontar, es que no hay stock suficiente
        if (pendienteDeDescontar > 0.001) { // Usamos pequeña tolerancia por decimales flotantes
          throw { 
            status: 409, 
            message: `Stock insuficiente para el producto ID ${item.producto_id}. Faltan ${pendienteDeDescontar} unidades/kg.` 
          };
        }

        // D. Cálculos de Precio y Descuento (Lógica original mantenida)
        const precioUnitario = presentacion.precio;
        const importeBase = precioUnitario * item.cantidad;
        let porcentajeDescuento = 0;

        if (data.cliente_id) {
          const descuentoReg = await tx.descuentos.findFirst({
            where: {
              cliente_id: data.cliente_id,
              producto_id: item.producto_id,
              deleted_at: null
            }
          });

          if (descuentoReg) {
            porcentajeDescuento = descuentoReg.descuento;
          }
        }

        const montoDescuento = importeBase * (porcentajeDescuento / 100);
        const precioFinalLinea = importeBase - montoDescuento;

        subtotalGeneral += importeBase;
        descuentoTotalPesos += montoDescuento;

        detallesParaGuardar.push({
          producto_id: item.producto_id,
          presentacion_id: item.presentacion_id,
          cantidad: item.cantidad,
          precio_final: precioFinalLinea,
          created_at: new Date()
        });
      } // Fin del ciclo de productos

      const totalGeneral = subtotalGeneral - descuentoTotalPesos;

      // 2. Guardar Venta en BD
      const nuevaVenta = await tx.ventas.create({
        data: {
          sucursal_id: data.sucursal_id,
          usuario_id: data.usuario_id,
          cliente_id: data.cliente_id ?? null,
          subtotal: subtotalGeneral,
          descuento: descuentoTotalPesos,
          total: totalGeneral,
          estado: "PENDIENTE",
          created_at: new Date(),
          detalle_ventas: {
            create: detallesParaGuardar
          }
        },
        include: {
          detalle_ventas: true,
          pagos: true,
          clientes: true,
          usuarios: true,
          sucursal: true
        }
      });

      // Retornamos dentro de la transacción
      return {
          ...nuevaVenta,
          saldo_pendiente: totalGeneral
      } as unknown as ISaleDetailed;

    }); // Fin de la transacción
  }

  // --- B. Registrar Pago (Sin cambios mayores, solo uso de tx) ---
  async addPayment(data: IAddPaymentRequest): Promise<IPaymentResponse> {
    return await prisma.$transaction(async (tx) => {
      // 1. Obtener Venta
      const venta = await tx.ventas.findUnique({
        where: { venta_id: data.venta_id },
        include: { pagos: true }
      });

      if (!venta) throw { status: 404, message: "Venta no encontrada" };
      if (venta.estado === "PAGADO") throw { status: 400, message: "Esta venta ya está pagada completamente" };

      // 2. Calcular saldos
      const totalPagadoHastaAhora = venta.pagos.reduce((acc, p) => acc + p.monto, 0);
      const saldoPendiente = venta.total - totalPagadoHastaAhora;

      // Tolerancia de centavos para validación
      if (data.monto > saldoPendiente + 0.5) {
        throw { 
            status: 400, 
            message: `El monto (${data.monto}) excede el saldo pendiente (${saldoPendiente})` 
        };
      }

      // 3. Registrar el Pago (Relación directa 1:N)
      const nuevoPago = await tx.pagos.create({
        data: {
          venta_id: data.venta_id,
          monto: data.monto,
          metodo_pago: data.metodo_pago,
          fecha_de_pago: new Date()
        }
      });
      
      // 4. Actualizar Estado de la Venta
      const nuevoTotalPagado = totalPagadoHastaAhora + data.monto;
      let nuevoEstado = venta.estado;

      // Tolerancia pequeña (1 peso) para errores de punto flotante
      if (Math.abs(nuevoTotalPagado - venta.total) < 1) {
        nuevoEstado = "PAGADO";
      } else {
        nuevoEstado = "EN_PROCESO";
      }

      if (nuevoEstado !== venta.estado) {
        await tx.ventas.update({
          where: { venta_id: venta.venta_id },
          data: { estado: nuevoEstado }
        });
      }

      return {
        ...nuevoPago,
        nuevo_estado_venta: nuevoEstado,
        saldo_restante: venta.total - nuevoTotalPagado
      };
    });
  }

  // --- C. Consultas (Sin cambios) ---
  async getById(ventaId: number): Promise<ISaleDetailed | null> {
    const venta = await prisma.ventas.findUnique({
        where: { venta_id: ventaId },
        include: { detalle_ventas: true, pagos: true, clientes: true, usuarios: true, sucursal: true }
    });
    
    if(!venta) return null;

    const pagado = venta.pagos.reduce((acc, p) => acc + p.monto, 0);
    return { ...venta, saldo_pendiente: venta.total - pagado } as unknown as ISaleDetailed;
  }

  async getAllByBranch(branchId: number): Promise<ISaleDetailed[]> {
    const ventas = await prisma.ventas.findMany({
        where: { sucursal_id: branchId },
        include: { detalle_ventas: true, pagos: true, clientes: true, usuarios: true, sucursal: true },
        orderBy: { created_at: 'desc' }
    });

    return ventas.map(v => ({
        ...v,
        saldo_pendiente: v.total - v.pagos.reduce((acc, p) => acc + p.monto, 0)
    })) as unknown as ISaleDetailed[];
  }
}