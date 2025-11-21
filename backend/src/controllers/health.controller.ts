import { Request, Response } from 'express';
import mongoose from 'mongoose';

export class HealthController {
  // Health check endpoint
  check(_req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  }

  // Detailed health check with database status
  async detailed(_req: Request, res: Response) {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
      success: true,
      message: 'Server is running',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          status: dbStatus,
          name: mongoose.connection.name,
        },
        memory: process.memoryUsage(),
      },
    });
  }
}

export const healthController = new HealthController();
