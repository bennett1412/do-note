import Fastify from "fastify";
import type { FastifyError } from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { routes } from "./routes.js";
import { dbClient } from "./db/index.js";
import { runMigrations } from "./db/migrate.js";

dotenv.config();

const server = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV === "production"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
  },
});

// Register CORS
server.register(cors, {
  origin: "*",
});

// Set up Zod compilers
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Register all routes
server.register(routes);

// Gracefully close DB on shutdown
server.addHook("onClose", async () => {
  await dbClient.close();
});

// Custom error handler
server.setErrorHandler((error: FastifyError, request, reply) => {
  if (error.validation) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Validation failed",
      details: error.validation.map((err: any) => ({
        field: err.instancePath.replace(/^\//, "") || "body",
        message: err.message,
      })),
    });
  }
  server.log.error(error);
  return reply.status(500).send({ error: "Internal Server Error" });
});

const start = async () => {
  try {
    // Run migrations on startup
    await runMigrations();

    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || "0.0.0.0";
    await server.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err: unknown) {
    server.log.error(err as Error);
    process.exit(1);
  }
};

start();
