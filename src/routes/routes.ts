import { Router } from "express";
import auth from "./auth/auth.controller";
import drivers from "./drivers/drivers.controller";

const api = Router().use(auth).use(drivers);

export default Router().use("/api", api);
