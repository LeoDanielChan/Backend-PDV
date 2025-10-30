import { Router } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

const employeeRouter = Router();

employeeRouter.use(authMiddleware);
employeeRouter.get("/:branchId", authorize([2]), getAllEmployees);
employeeRouter.get("/:branchId/:id", authorize([2]), getEmployeeById);
employeeRouter.post("/", authorize([2]), createEmployee);
employeeRouter.put("/:branchId/:id", authorize([2]), updateEmployee);
employeeRouter.delete("/:branchId/:id", authorize([2]), deleteEmployee);

export default employeeRouter;
