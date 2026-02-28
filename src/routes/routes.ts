import { Router } from "express";
import auth from "./auth/auth.controller";
import instructor from "./instructor/instructor.controller";
import user from "./user/user.controller";

const api = Router().use(auth).use(instructor).use(user);

export default Router().use("/api", api);
