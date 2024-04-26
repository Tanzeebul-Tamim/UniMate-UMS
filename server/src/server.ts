/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(
        `😇 UniMate-University Management System app is listening on port ${config.port} 😇`,
      );
    });
  } catch (err) {
    console.error(err);
  }
}

main();

//* Handling unhandled rejection (for asynchronous operations)
process.on('unhandledRejection', () => {
  console.error('⚠ Unhandled rejection detected, server shutting down.... ⚠');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//* Handling uncaught exception (for synchronous operations)
process.on('uncaughtException', () => {
  console.error('⚠ Uncaught exception detected, server shutting down.... ⚠');
  process.exit(1);
});