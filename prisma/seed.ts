import { licenseCategoryMain } from './seeders/category';

async function main() {
  console.log('iniciar seeder');

  await licenseCategoryMain();

  console.log('finalizar seeder');
}

main();
