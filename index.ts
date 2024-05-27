import app from "./src/app";
import connectDB from "./src/config/db";
import { config } from "./src/config/config";

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
