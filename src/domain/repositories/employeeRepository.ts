import {
  IEmployeeResponse,
  IEmployeeDetailedResponse,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
} from "../models/IEmployee";

export interface EmployeeRepository {
  getAllEmployees(branchId: number): Promise<IEmployeeResponse[]>;
  
  getEmployeeById(
    employeeId: number
  ): Promise<IEmployeeDetailedResponse | null>;

  createEmployee(
    creatorUserId: number,
    data: IEmployeeCreateRequest
  ): Promise<IEmployeeDetailedResponse>;

  updateEmployee(
    employeeId: number,
    data: IEmployeeUpdateRequest
  ): Promise<IEmployeeResponse>;

  deleteEmployee(employeeId: number): Promise<void>;
}
