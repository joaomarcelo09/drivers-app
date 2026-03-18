import { prisma } from "../../src/database/client";

const vehicleTypes = [
  {
    id: 1,
    name: "car",
    description: "Carro",
    id_seeder: 1,
  },
  {
    id: 2,
    name: "motorcycle",
    description: "Moto",
    id_seeder: 2,
  },
  {
    id: 3,
    name: "truck",
    description: "Caminhão",
    id_seeder: 3,
  },
  {
    id: 4,
    name: "bus",
    description: "Ônibus",
    id_seeder: 4,
  },
];

export async function vehicleTypeMain() {
  const dbVehicleTypes = await prisma.vehicleType.findMany();

  const toDelete = dbVehicleTypes.filter((db) => !vehicleTypes.some((vt) => vt.id_seeder === db.id_seeder));

  const toAdd = vehicleTypes.filter((vt) => !dbVehicleTypes.some((db) => db.id_seeder === vt.id_seeder));

  const toUpdate = vehicleTypes.filter((vt) => dbVehicleTypes.some((db) => db.id_seeder === vt.id_seeder));

  const requests: Promise<any>[] = [];

  if (toDelete.length) {
    await prisma.vehicleType.deleteMany({
      where: {
        id: {
          in: toDelete.map((d) => d.id),
        },
      },
    });
  }

  if (toAdd.length) {
    requests.push(
      prisma.vehicleType.createMany({
        data: toAdd,
      }),
    );
  }

  if (toUpdate.length) {
    const updateRequests = toUpdate.map((vt) => {
      const dbItem = dbVehicleTypes.find((db) => db.id_seeder === vt.id_seeder);

      return prisma.vehicleType.update({
        where: { id: dbItem?.id },
        data: {
          name: vt.name,
          description: vt.description,
        },
      });
    });

    requests.push(...updateRequests);
  }

  await Promise.all(requests);

  const added = await prisma.vehicleType.findMany();
  console.log("added vehicle types", added);
  return true;
}
