import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import { connectDB, getDb } from './lib/db';
import { envConfig } from './config/env.config';
import { swaggerSpec } from './config/swagger.config';
import authRoutes from './routes/auth.routes';
import {
  errorResponse,
  getStatusCodeFromError,
  formatErrorMessage,
  handleZodError,
  AppError,
} from './utils';
import { ERROR_MESSAGES, HTTP_STATUS } from './constants';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Splitwise API Documentation',
  })
);

app.get('/health', (req: Request, res: Response) => {
  const db = getDb();
  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

app.use((req: Request, res: Response) => {
  return errorResponse(
    res,
    ERROR_MESSAGES.SERVER.ROUTE_NOT_FOUND,
    HTTP_STATUS.NOT_FOUND
  );
});

app.use(
  (
    err: Error | ZodError | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error('Error:', err);

    if (err instanceof ZodError) {
      const message = handleZodError(err);
      return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST);
    }

    if (err instanceof AppError) {
      return errorResponse(res, err.message, err.statusCode);
    }

    const statusCode = getStatusCodeFromError(err);
    const message =
      formatErrorMessage(err, envConfig.NODE_ENV === 'development') ||
      ERROR_MESSAGES.SERVER.INTERNAL_ERROR;

    return errorResponse(res, message, statusCode);
  }
);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = envConfig.PORT;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${envConfig.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  } catch (error: any) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error(
      '\n💡 Hãy đảm bảo MongoDB đang chạy trước khi start server.\n'
    );
    process.exit(1);
  }
};

startServer();
