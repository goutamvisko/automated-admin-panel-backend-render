import 'dotenv/config';
import { seedAdmin } from './adminSeeder.js';

const runSeeders = async () => {
  try {
    console.log('Starting database seeding process...');

    await seedAdmin();
    console.log('Admin seeded successfully.');
    

    console.log('All seeders completed successfully!');
  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

runSeeders();
