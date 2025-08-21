import { Request, Response } from "express";
import { employeeUserUseCase } from "@/domain/use-cases/employeeUser";
import { jwtService } from "@/infrastructure/auth/jwtService";

function getUserIdFromToken(req: Request): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  const payload = jwtService.verify(token);
  return payload?.userId || null;
}

export const getAllEmployees = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.branchId);
  const employees = await employeeUserUseCase.getAllEmployees(branchId);
  return res.status(200).json({ employees });
};

export const getEmployeeById = async (req: Request, res: Response): Promise<any> => {
  const employeeId = Number(req.params.id);
  const employee = await employeeUserUseCase.getEmployeeById(employeeId);
  if (!employee) return res.status(404).json({ message: "Empleado no encontrado" });
  return res.status(200).json({ employee });
};

export const createEmployee = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.branchId);
  const employee = await employeeUserUseCase.createEmployee(branchId, req.body);
  return res.status(201).json({ employee });
};

export const updateEmployee = async (req: Request, res: Response): Promise<any> => {
  const employeeId = Number(req.params.id);
  const employee = await employeeUserUseCase.updateEmployee(employeeId, req.body);
  return res.status(200).json({ employee });
};

export const deleteEmployee = async (req: Request, res: Response): Promise<any> => {
  const employeeId = Number(req.params.id);
  await employeeUserUseCase.deleteEmployee(employeeId);
  return res.status(204).send();
};
