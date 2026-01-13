import { NextFunction, Router } from "express";
import { getInstructors } from "../../services/instructors.service";
import authMiddleware from "../../middleware/securityMiddleware";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { bio, active, minPrice, maxPrice, lat, lng, radius = 5 } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);

    const hasValidCoords =
      Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;

    const distance = Number(radius) / 111;

    const where = {
      AND: [
        bio && {
          bio: { contains: bio as string, mode: "insensitive" },
        },

        active !== undefined && {
          active: active === "true",
        },

        (minPrice || maxPrice) && {
          priceHour: {
            gte: minPrice ? Number(minPrice) : undefined,
            lte: maxPrice ? Number(maxPrice) : undefined,
          },
        },

        hasValidCoords && {
          latitude: {
            gte: latitude - distance,
            lte: latitude + distance,
          },
          longitude: {
            gte: longitude - distance,
            lte: longitude + distance,
          },
        },
      ].filter(Boolean),
    };

    const instructors = await getInstructors(where);
    res.send(instructors);
  } catch (error) {
    next(error);
  }
});

export default Router().use("/drivers", authMiddleware.required, router);
