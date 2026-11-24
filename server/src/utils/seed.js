import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Issuer } from '../models/Issuer.js';

const DEMO_ISSUER = {
  name: 'Krish Yadav',
  organization: 'BMS College of Engineering',
  email: 'admin@veritas.edu',
  password: 'VeritasDemo123!',
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding.');

    // Idempotent check: update in place if already exists, otherwise create
    const existingIssuer = await Issuer.findOne({ email: DEMO_ISSUER.email });

    if (existingIssuer) {
      existingIssuer.name = DEMO_ISSUER.name;
      existingIssuer.organization = DEMO_ISSUER.organization;
      await existingIssuer.save();
      console.log(`✅ Updated existing demo issuer: ${DEMO_ISSUER.name} (${DEMO_ISSUER.organization}) [${DEMO_ISSUER.email}]`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(DEMO_ISSUER.password, salt);

      await Issuer.create({
        name: DEMO_ISSUER.name,
        organization: DEMO_ISSUER.organization,
        email: DEMO_ISSUER.email,
        passwordHash,
      });

      console.log(`✅ Demo issuer created successfully: ${DEMO_ISSUER.name} (${DEMO_ISSUER.organization}) [${DEMO_ISSUER.email}]`);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

seed();
