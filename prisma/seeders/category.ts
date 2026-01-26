import { prisma } from "../../src/database/client";

const categories = [
  {
    id: 1,
    acronym: 'A',
    description: 'A',
    id_seeder: 1,
  },
  {
    id: 2,
    acronym: 'B',
    description: 'B',
    id_seeder: 2,
  },
  {
    id: 3,
    acronym: 'C',
    description: 'C',
    id_seeder: 3,
  },
];

export async function licenseCategoryMain(tx?) {

  // Get current data from DB
  const dbCategories = await prisma.licenseCategory.findMany();

  const toDelete = dbCategories.filter(
    (db) => !categories.some((cat) => cat.id_seeder === db.id_seeder),
  );

  const toAdd = categories.filter(
    (cat) => !dbCategories.some((db) => db.id_seeder === cat.id_seeder),
  );

  const toUpdate = categories.filter((cat) =>
    dbCategories.some((db) => db.id_seeder === cat.id_seeder),
  );

  const requests: Promise<any>[] = [];

  // DELETE
  if (toDelete.length) {
    await prisma.licenseCategory.deleteMany({
      where: {
        id: {
          in: toDelete.map((d) => d.id),
        },
      },
    });
  }

  // CREATE
  if (toAdd.length) {
    requests.push(
      prisma.licenseCategory.createMany({
        data: toAdd,
      }),
    );
  }

  // UPDATE
  if (toUpdate.length) {
    const updateRequests = toUpdate.map((cat) => {
      const dbItem = dbCategories.find(
        (db) => db.id_seeder === cat.id_seeder,
      );

      return prisma.licenseCategory.update({
        where: { id: dbItem.id },
        data: {
          acronym: cat.acronym,
          description: cat.description,
        },
      });
    });

    requests.push(...updateRequests);
  }

  await Promise.all(requests);

  const added = await prisma.licenseCategory.findMany();
  console.log('added', added);
  return true;
}
