import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB asynchronously
connectDB();

// Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 Veritas server running on port ${PORT}`);
});
