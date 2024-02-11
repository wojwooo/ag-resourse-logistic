import { Application } from "express";
import citiesRoutes from "./cities.routes";
import ordersRoutes from "./orders.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/cities", citiesRoutes);
    app.use("/orders", ordersRoutes);
  }
}
