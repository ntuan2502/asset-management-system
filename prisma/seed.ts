import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { provinces } from './data/provinces';
import { ADMIN_ID } from 'src/common/constants';
import { wards } from './data/wards';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const passwordHash = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@tun.io.vn' },
    });

    if (admin) throw new BadRequestException(`Admin account already exists`);

    await prisma.user.create({
      data: {
        id: ADMIN_ID,
        fullname: 'Admin',
        email: 'admin@tun.io.vn',
        password: passwordHash,
        createdById: ADMIN_ID,
      },
    });

    console.log('✅ Admin seeded successfully!');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

async function seedProvinces() {
  try {
    // await prisma.$executeRaw`TRUNCATE TABLE "Office" RESTART IDENTITY CASCADE`;
    // console.log('✅ Cleared existing Office and reset IDs');

    for (let i = 0; i < provinces.length; i++) {
      const province = provinces[i];

      await prisma.province.upsert({
        where: { provinceCode: province.province_code },
        update: {
          name: province.name,
          shortName: province.short_name,
          code: province.code,
          placeType: province.place_type,
          country: province.country,
          updatedById: ADMIN_ID,
        },
        create: {
          provinceCode: province.province_code,
          name: province.name,
          shortName: province.short_name,
          code: province.code,
          placeType: province.place_type,
          country: province.country,
          createdById: ADMIN_ID,
        },
      });
      console.log(
        `Seeded province ${i + 1}/${provinces.length}: ${province.name}`,
      );
    }

    console.log('province seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding provinces:', error);
  }
}

async function seedWards() {
  try {
    // await prisma.$executeRaw`TRUNCATE TABLE "Office" RESTART IDENTITY CASCADE`;
    // console.log('✅ Cleared existing Office and reset IDs');

    for (let i = 0; i < wards.length; i++) {
      const ward = wards[i];

      const province = await prisma.province.findFirst({
        where: { provinceCode: ward.province_code },
      });
      if (!province) {
        continue;
      }
      await prisma.ward.upsert({
        where: { wardCode: ward.ward_code },
        update: {
          name: ward.name,
          provinceCode: ward.province_code,
          updatedById: ADMIN_ID,
        },
        create: {
          provinceId: province.id,
          wardCode: ward.ward_code,
          name: ward.name,
          provinceCode: ward.province_code,
          createdById: ADMIN_ID,
        },
      });
      console.log(`Seeded ward ${i + 1}/${wards.length}: ${ward.name}`);
    }

    console.log('ward seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding wards:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--admin')) {
    await seedAdmin();
  } else if (args.includes('--all')) {
    await seedAdmin();
    await seedProvinces();
    await seedWards();
  } else {
    console.log('Please specify a seed type. Available options:');
    console.log('  bun run seed --admin');
    console.log('  bun run seed --all');
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .catch((e) => console.error('Error during disconnect:', e));
  });
