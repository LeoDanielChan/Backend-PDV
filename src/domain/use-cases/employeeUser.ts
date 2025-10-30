import { passwordService } from "@/infrastructure/auth/passwordService";
import { EmployeeRepository } from "../repositories/employeeRepository";
import { prisma } from "@/config/prismaClient";
import { timeStringToDate } from "@/utils/timeUtilis";
import {
  IEmployeeResponse,
  IEmployeeDetailedResponse,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IHttpError,
} from "../models/IEmployee";

const getEmployeeDetailed = async (
  employeeId: number
): Promise<IEmployeeDetailedResponse | null> => {
  return (await prisma.empleado.findFirst({
    where: { empleado_id: employeeId },
    include: {
      usuarios_empleado_id_usuarioTousuarios: {
        include: {
          personas: true,
        },
      },
      usuarios_empleado_id_usuario_registroTousuarios: true,
    },
  })) as IEmployeeDetailedResponse | null;
};

class EmployeeUserUseCase implements EmployeeRepository {
  async getAllEmployees(branchId: number): Promise<IEmployeeResponse[]> {
    return (await prisma.empleado.findMany({
      where: { id_sucursal: branchId },
    })) as IEmployeeResponse[];
  }

  async getEmployeeById(
    employeeId: number
  ): Promise<IEmployeeDetailedResponse | null> {
    return getEmployeeDetailed(employeeId);
  }

  async createEmployee(
    creatorUserId: number,
    data: IEmployeeCreateRequest
  ): Promise<IEmployeeDetailedResponse> {
    const exists = await prisma.usuarios.findFirst({
      where: { correo: data.usuario.correo },
    });
    if (exists) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message: "El correo del empleado ya está registrado.",
      };
      throw error;
    }

    const { persona, usuario, empleado } = data;
    const hashedPassword = await passwordService.hash(usuario.contrasena);

    const newEmployeeTransaction = await prisma.$transaction(async (prisma) => {
      const newPersona = await prisma.personas.create({
        data: {
          ...persona,
          fecha_nacimiento: new Date(persona.fecha_nacimiento),
        },
      });

      const newUser = await prisma.usuarios.create({
        data: {
          correo: usuario.correo,
          contrasena: hashedPassword,
          cambia_contrasena: true,
          id_persona: newPersona.persona_id,
          fecha_registro: new Date(),
          id_tipo_usuario: usuario.id_tipo_usuario,
        },
      });

      return await prisma.empleado.create({
        data: {
          ...empleado,
          id_usuario: newUser.usuario_id,
          id_usuario_registro: creatorUserId,
          id_sucursal: empleado.id_sucursal,
          fecha_contratacion: new Date(empleado.fecha_contratacion),
          fecha_registro: new Date(),
          activo: 1,
          horas_trabajo: empleado.horas_trabajo
            ? timeStringToDate(empleado.horas_trabajo)
            : undefined,
        },
      });
    });

    return getEmployeeDetailed(
      newEmployeeTransaction.empleado_id
    ) as Promise<IEmployeeDetailedResponse>;
  }

  async updateEmployee(
    employeeId: number,
    data: IEmployeeUpdateRequest
  ): Promise<IEmployeeResponse> {
    const { persona, usuario, empleado } = data;

    if (!empleado) {
      const error: IHttpError = {
        name: "BadRequest",
        status: 400,
        message: "No se proporcionaron datos de empleado para actualizar.",
      };
      throw error;
    }

    return (await prisma.empleado.update({
      where: { empleado_id: employeeId },
      data: empleado,
    })) as IEmployeeResponse;
  }

  async deleteEmployee(employeeId: number): Promise<void> {
    await prisma.empleado.delete({ where: { empleado_id: employeeId } });
  }
}

export const employeeUserUseCase = new EmployeeUserUseCase();
