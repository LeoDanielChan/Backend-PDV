import { Request, Response } from "express";
import { employeeUserUseCase } from "@/domain/use-cases/employeeUser";
import { AuthRequest } from "../middleware/authMiddleware";
import { ZodError } from "zod";
import {
  EmployeeCreateValidator,
  EmployeeUpdateValidator,
} from "../validators/employee.validator";
import {
  IEmployeeResponse,
  IEmployeeDetailedResponse,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IHttpError,
  IZodErrorResponse,
} from "@/domain/models/IEmployee";

type EmployeeErrorResponse = { message: string } | IZodErrorResponse;

export const getAllEmployees = async (
  req: Request<{ branchId: string }>,
  res: Response<IEmployeeResponse[] | EmployeeErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId))
      return res.status(400).json({ message: "ID de sucursal inválido" });

    const employees = await employeeUserUseCase.getAllEmployees(branchId);
    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener empleados" });
  }
};

export const getEmployeeById = async (
  req: Request<{ id: string }>,
  res: Response<IEmployeeDetailedResponse | EmployeeErrorResponse>
): Promise<any> => {
  try {
    const employeeId = Number(req.params.id);
    if (isNaN(employeeId))
      return res.status(400).json({ message: "ID de empleado inválido" });

    const employee = await employeeUserUseCase.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error("Error al obtener empleado:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener empleado" });
  }
};

export const createEmployee = async (
  req: Request<{}, {}, IEmployeeCreateRequest>,
  res: Response<IEmployeeDetailedResponse | EmployeeErrorResponse>
): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const creatorUserId = dataReq.user.id;

    const data: IEmployeeCreateRequest = EmployeeCreateValidator.parse(
      req.body
    );

    const employee = await employeeUserUseCase.createEmployee(
      creatorUserId,
      data
    );

    return res.status(201).json(employee);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Campos inválidos", errors: error.issues });
    }
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al crear empleado:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear empleado" });
  }
};

export const updateEmployee = async (
  req: Request<{ branchId: string; id: string }, {}, IEmployeeUpdateRequest>,
  res: Response<IEmployeeResponse | EmployeeErrorResponse>
): Promise<any> => {
  try {
    const employeeId = Number(req.params.id);
    if (isNaN(employeeId))
      return res.status(400).json({ message: "ID de empleado inválido" });

    const data: IEmployeeUpdateRequest = EmployeeUpdateValidator.parse(
      req.body
    );

    const employee = await employeeUserUseCase.updateEmployee(employeeId, data);
    return res.status(200).json(employee);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Campos inválidos", errors: error.issues });
    }
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al actualizar empleado:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar empleado" });
  }
};

export const deleteEmployee = async (
  req: Request<{ id: string }>,
  res: Response<void | EmployeeErrorResponse>
): Promise<any> => {
  try {
    const employeeId = Number(req.params.id);
    if (isNaN(employeeId))
      return res.status(400).json({ message: "ID de empleado inválido" });

    await employeeUserUseCase.deleteEmployee(employeeId);
    return res.status(204).send();
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al eliminar empleado:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar empleado" });
  }
};
