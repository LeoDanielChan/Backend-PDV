import { Request, Response } from "express";
import { DiscountUser } from "@/domain/use-cases/discountUser";
import { DiscountCreateValidator, DiscountUpdateValidator } from "../validators/discount.validator";
import { ZodError } from "zod";

const discountUser = new DiscountUser();

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const data = DiscountCreateValidator.parse(req.body);
    const result = await discountUser.create(data);
    res.status(201).json(result);
  } catch (error) { handleError(res, error); }
};

export const update = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const data = DiscountUpdateValidator.parse(req.body);
    const result = await discountUser.update(id, data);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

export const remove = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    await discountUser.delete(id);
    res.status(204).send();
  } catch (error) { handleError(res, error); }
};

export const getByClient = async (req: Request, res: Response): Promise<any> => {
  try {
    const clientId = Number(req.params.clientId);
    const result = await discountUser.getAllByClient(clientId);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

function handleError(res: Response, error: any) {
  if (error instanceof ZodError) return res.status(400).json({ errors: error.issues });
  if (error.status) return res.status(error.status).json({ message: error.message });
  res.status(500).json({ message: "Error interno" });
}