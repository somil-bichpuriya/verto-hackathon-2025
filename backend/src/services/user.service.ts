import { User, IUser } from '../models/User.model';
import { AppError } from '../utils/AppError';

export class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const user = await User.create(userData);
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find({ isActive: true }).select('-password');
    return users;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }
  }
}

export const userService = new UserService();
