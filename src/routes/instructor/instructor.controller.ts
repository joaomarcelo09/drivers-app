import { NextFunction, Request, Response, Router } from "express";
import { getInstructor, getInstructors } from "../../services/instructors.service";
import authMiddleware from "../../middleware/securityMiddleware";
import { instructorResponseSchema } from "../../schemas/instructorSchema";
import { InstructorWhereInput } from "../../../generated/prisma/models";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver and instructor search endpoints
 */

/**
 * @swagger
 * /api/instructor:
 *   get:
 *     summary: Get instructors with filters
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bio
 *         schema:
 *           type: string
 *         description: Filter instructors by bio text
 *         example: calm instructor
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per hour
 *         example: 50
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per hour
 *         example: 120
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude for location filtering
 *         example: -23.55052
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude for location filtering
 *         example: -46.633308
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Search radius in kilometers (default 5km)
 *         example: 5
 *     responses:
 *       200:
 *         description: List of instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   priceHour:
 *                     type: number
 *                   active:
 *                     type: boolean
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bio, active, minPrice, maxPrice, lat, lng, radius = 5 } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);

    const hasValidCoords =
      Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;

    // Approx: 1 degree ≈ 111km
    const distance = Number(radius) / 111;

    const conditions: InstructorWhereInput[] = [];

    if (bio) {
      conditions.push({ bio: { contains: bio as string, mode: "insensitive" } });
    }

    if (active !== undefined) {
      conditions.push({ active: active === "true" });
    }

    if (minPrice || maxPrice) {
      conditions.push({
        priceHour: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      });
    }

    if (hasValidCoords) {
      conditions.push({
        latitude: {
          gte: latitude - distance,
          lte: latitude + distance,
        },
        longitude: {
          gte: longitude - distance,
          lte: longitude + distance,
        },
      });
    }

    const where: InstructorWhereInput = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    const instructors = await getInstructors(where);
    res.json(instructors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = {
      id: Number(id),
    };

    const instructor = await getInstructor(where);
    const response = instructorResponseSchema.parse(instructor);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

export default Router().use("/instructor", authMiddleware.required, router);
