export interface EmployeeRepository {
  getAllEmployees(branchId: number): Promise<any[]>;
  getEmployeeById(employeeId: number): Promise<any>;
  createEmployee(branchId: number, data: any): Promise<any>;
  updateEmployee(employeeId: number, data: any): Promise<any>;
  deleteEmployee(employeeId: number): Promise<void>;
}
