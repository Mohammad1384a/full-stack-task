import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import ds from '../db/data-source';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  await ds.initialize();

  const userRepo = ds.getRepository(User);

  const exists = await userRepo.findOne({
    where: { email: 'admin@example.com' },
  });
  if (!exists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await userRepo.save(
      userRepo.create({
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash,
        role: 'admin',
      }),
    );
    console.log('Seeded admin: admin@example.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  await ds.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
