import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import envConfig from './src/config/env.config.js';

// Connect to MongoDB
connectDB();


const PORT = envConfig.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});