import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import OlistController from "../controller/olist.controller";

const routes = Router();

//order items routes
routes.get("/order_items", authMiddleware, OlistController.getOrderItems);

routes.delete(
  "/order_items/:id",
  authMiddleware,
  OlistController.deleteOrderById
);

export default routes;
