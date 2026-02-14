import { Router } from "express";
import auth from "./auth/auth.controller";
import instructor from "./instructor/instructor.controller";

const api = Router().use(auth).use(instructor);

export default Router().use("/api", api);
