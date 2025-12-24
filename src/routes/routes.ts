import { Router } from "express";
import auth from "./auth/auth.controller";

const api = Router().use(auth);

export default Router().use("/api", api);
