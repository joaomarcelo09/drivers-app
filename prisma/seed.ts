import { licenseCategoryMain } from "./seeders/category";
import { vehicleTypeMain } from "./seeders/vehicleType";

async function main() {
  console.log("iniciar seeder");

  await licenseCategoryMain();
  await vehicleTypeMain();

  console.log("finalizar seeder");
}

main();
