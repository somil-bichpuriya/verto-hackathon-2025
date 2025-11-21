import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { VertoAdmin } from '../models/VertoAdmin.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEMO_ADMIN_ID = '507f1f77bcf86cd799439011';

async function seedAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/verto-db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await VertoAdmin.findById(DEMO_ADMIN_ID);
    
    if (existingAdmin) {
      console.log('Demo admin already exists');
      await mongoose.disconnect();
      return;
    }

    // Create demo admin with specific ID
    const demoAdmin = new VertoAdmin({
      _id: DEMO_ADMIN_ID,
      username: 'demo-admin',
      passwordHash: 'demo-hash-not-for-production',
      role: 'admin',
      isActive: true
    });

    await demoAdmin.save();
    console.log('Demo admin created successfully');
    console.log('Admin ID:', DEMO_ADMIN_ID);
    console.log('Username:', demoAdmin.username);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
