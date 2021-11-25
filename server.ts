import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from 'dotenv';
import { initDbClient } from './api/util/database';
import { Request, Response, NextFunction } from 'express';
import { handleError } from './api/util/error-handler';
import usersController from './api/users/users-contoller';
async function createServer() {
  /*---------------------------------------------------------
                    Init Middlewares
  ----------------------------------------------------------*/
  config();
  await initDbClient();
  const app = express();
  // Append required middlewares
  app.use(cors());
  app.use(express.json());
  /*---------------------------------------------------------
                   Serve React App
  ----------------------------------------------------------*/
  app.use('/api/users', usersController());

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'not_found',
      error_description: `Cannot ${req.method} ${req.url}`,
    });
  });

  /*---------------------------------------------------------
                   Error handler
  ----------------------------------------------------------*/

  app.use((err, req: Request, res: Response, _next: NextFunction) => {
    handleError(err, res);
  });

  /*---------------------------------------------------------
                   Start server
  ----------------------------------------------------------*/
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port', process.env.PORT || 3000);
  });
}

createServer();
