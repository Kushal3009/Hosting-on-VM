require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const { syncDatabase } = require('./src/models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to PostgreSQL database...');
    await testConnection();

    console.log('Synchronizing Sequelize models...');
    // await syncDatabase();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Server is running on: http://localhost:${PORT}`);
      console.log(`📡 API Endpoints available at: http://localhost:${PORT}/api/items`);
      console.log(`💻 Visual Dashboard at: http://localhost:${PORT}`);
      console.log(`🩺 Health check at: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('Fatal error during startup:', error);
    process.exit(1);
  }
};

startServer();
