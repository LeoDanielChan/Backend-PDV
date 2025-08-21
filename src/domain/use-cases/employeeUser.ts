import { EmployeeRepository } from "../repositories/employeeRepository";
import { prisma } from "@/config/prismaClient";

class EmployeeUserUseCase implements EmployeeRepository {
  async getAllEmployees(branchId: number): Promise<any[]> {
    return await prisma.empleado.findMany({ where: { id_sucursal: branchId } });
  }
  async getEmployeeById(employeeId: number): Promise<any> {
    return await prisma.empleado.findUnique({ where: { empleado_id: employeeId } });
  }
  async createEmployee(branchId: number, data: any): Promise<any> {
    return await prisma.empleado.create({ data: { ...data, id_sucursal: branchId } });
  }
  async updateEmployee(employeeId: number, data: any): Promise<any> {
    return await prisma.empleado.update({ where: { empleado_id: employeeId }, data });
  }
  async deleteEmployee(employeeId: number): Promise<void> {
    await prisma.empleado.delete({ where: { empleado_id: employeeId } });
  }
}

export const employeeUserUseCase = new EmployeeUserUseCase();
