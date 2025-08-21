import { Router } from "express";
import { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employee.controller";

const employeeRouter = Router();

employeeRouter.get("/branches/:branchId/employees", getAllEmployees);
employeeRouter.get("/branches/:branchId/employees/:id", getEmployeeById);
employeeRouter.post("/branches/:branchId/employees", createEmployee);
employeeRouter.put("/branches/:branchId/employees/:id", updateEmployee);
employeeRouter.delete("/branches/:branchId/employees/:id", deleteEmployee);

export default employeeRouter;
