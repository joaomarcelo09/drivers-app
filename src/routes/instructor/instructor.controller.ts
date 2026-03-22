import { NextFunction, Request, Response, Router } from "express";
import { getInstructor, getInstructors } from "../../services/instructors.service";
import authMiddleware from "../../middleware/securityMiddleware";
import { instructorResponseSchema } from "../../schemas/instructorSchema";
import { InstructorWhereInput } from "../../../generated/prisma/models";

const router = Router();

const transformInstructor = (instructor: any) => {
  if (!instructor) return null;

  return {
    id: instructor.id,
    createdAt: instructor.createdAt,
    name: instructor.user?.name || "",
    email: instructor.user?.email || "",
    telephone: instructor.user?.telephone || "",
    city: instructor.user?.city || "",
    state: instructor.user?.state || "",
    cnh: instructor.cnh || "",
    hasVehicle: instructor.hasVehicle || false,
    photo: instructor.user?.photo || "",
    rating: instructor.rating || 0,
    reviewCount: 0,
    distance: 0,
    rangeKm: instructor.rangeKm || 0,
    pricePerHour: instructor.priceHour,
    vehicleTypes: instructor.instructorVehicles?.map((iv: any) => iv.vehicleType?.id) || [],
    categories: instructor.instructorCategories?.map((ic: any) => ic.licenseCategory?.acronym) || [],
    gender: instructor.user?.gender,
    bio: instructor.bio,
  };
};

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
router.get("/", authMiddleware.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bio, active, minPrice, maxPrice, lat, lng, radius = 5, minRating, maxRating, gender, categories, rangeKm, vehicleTypes } = req.query;

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

    if (minRating || maxRating) {
      conditions.push({
        rating: {
          gte: minRating ? Number(minRating) : undefined,
          lte: maxRating ? Number(maxRating) : undefined,
        },
      });
    }

    if (rangeKm) {
      conditions.push({
        rangeKm: {
          gte: Number(rangeKm),
        },
      });
    }

    if (gender) {
      conditions.push({
        user: {
          gender: (gender as string).toUpperCase() as "MALE" | "FEMALE",
        },
      });
    }

    if (categories) {
      const categoryList = (categories as string).split(",").map((c: string) => c.trim().toUpperCase());
      conditions.push({
        instructorCategories: {
          some: {
            licenseCategory: {
              acronym: {
                in: categoryList as any[],
              },
            },
          },
        },
      });
    }

    if (vehicleTypes) {
      const vehicleTypeList = (vehicleTypes as string).split(",").map((v: string) => Number(v.trim()));
      conditions.push({
        instructorVehicles: {
          some: {
            vehicleTypeId: {
              in: vehicleTypeList,
            },
          },
        },
      });
    }

    const where: InstructorWhereInput = {
      AND: conditions.length > 0 ? conditions : undefined,
    };

    const instructors = await getInstructors(where);
    const transformedInstructors = instructors.map(transformInstructor);
    res.json(transformedInstructors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authMiddleware.optional, async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = {
      id: Number(id),
    };

    const instructor = await getInstructor(where);
    const transformed = transformInstructor(instructor);
    const response = instructorResponseSchema.parse(transformed);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

export default Router().use("/instructor", router);
