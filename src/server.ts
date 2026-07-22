import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";



const main = async() => {
try {
    await prisma.$connect();
    console.log('Database initialized successfully.');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
