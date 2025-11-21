import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../middleware/errorHandler';

export class UserController {
  /**
   * Get all users
   */
  getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  });

  /**
   * Get user by ID
   */
  getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  /**
   * Create new user
   */
  createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  });

  /**
   * Update user
   */
  updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  });

  /**
   * Delete user
   */
  deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });
}

export const userController = new UserController();
