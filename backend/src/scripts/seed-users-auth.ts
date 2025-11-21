import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { Customer } from '../models/Customer.model';
import { Partner } from '../models/Partner.model';
import { VertoAdmin } from '../models/VertoAdmin.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEMO_ADMIN_ID = '507f1f77bcf86cd799439011';
const DEMO_PASSWORD = 'Demo@123'; // Demo password for all users

async function seedUsersWithAuth() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/verto-db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Hash password
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    console.log('Password hashed successfully');

    // Update existing admin with password
    const admin = await VertoAdmin.findById(DEMO_ADMIN_ID);
    if (admin) {
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log('✓ Admin password updated');
      console.log('  Username: demo-admin');
      console.log('  Password: Demo@123');
    } else {
      console.log('✗ Admin not found - run seed-admin.ts first');
    }

    // Find or create demo customer
    let customer = await Customer.findOne({ email: 'demo@customer.com' });
    if (!customer) {
      customer = new Customer({
        companyName: 'Demo Customer Company',
        email: 'demo@customer.com',
        address: '123 Demo Street, Demo City, DC 12345',
        passwordHash,
      });
      await customer.save();
      console.log('✓ Demo customer created');
    } else {
      customer.passwordHash = passwordHash;
      await customer.save();
      console.log('✓ Demo customer password updated');
    }
    console.log('  Email: demo@customer.com');
    console.log('  Password: Demo@123');

    // Find or create demo partner
    let partner = await Partner.findOne({ email: 'demo@partner.com' });
    if (!partner) {
      partner = new Partner({
        companyName: 'Demo Partner Company',
        email: 'demo@partner.com',
        documentTypesConfig: [],
        isActive: true,
        passwordHash,
      });
      await partner.save();
      console.log('✓ Demo partner created');
    } else {
      partner.passwordHash = passwordHash;
      await partner.save();
      console.log('✓ Demo partner password updated');
    }
    console.log('  Email: demo@partner.com');
    console.log('  Password: Demo@123');
    console.log('  API Key:', partner.apiKey);

    console.log('\n=== All demo users ready for login ===');
    console.log('\nCustomer Login:');
    console.log('  Email: demo@customer.com');
    console.log('  Password: Demo@123');
    console.log('\nPartner Login:');
    console.log('  Email: demo@partner.com');
    console.log('  Password: Demo@123');
    console.log('\nAdmin Login:');
    console.log('  Username: demo-admin');
    console.log('  Password: Demo@123');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsersWithAuth();
