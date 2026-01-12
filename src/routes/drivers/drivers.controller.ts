import { NextFunction, Router } from "express";
import { getInstructors } from "../../services/instructors.service";
import authMiddleware from "../../middleware/securityMiddleware";

const router = Router();

router.get("/", async (req, res, next: NextFunction) => {
  try {
    const where = {
    }

    const instructors = await getInstructors(where);

    res.send(instructors);
  } catch (error) {
    next(error);
  }
})

export default Router().use("/drivers", authMiddleware.required, router);
