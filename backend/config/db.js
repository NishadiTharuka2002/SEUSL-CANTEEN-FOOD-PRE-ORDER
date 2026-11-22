const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in restricted environments
}

const SRV_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://tharukanishadi2023_db_user:Nishadi12345@cluster0.xj4reyt.mongodb.net/university_canteen?retryWrites=true&w=majority';

const DIRECT_URI =
  'mongodb://tharukanishadi2023_db_user:Nishadi12345@ac-n9scwnj-shard-00-00.xj4reyt.mongodb.net:27017,ac-n9scwnj-shard-00-01.xj4reyt.mongodb.net:27017,ac-n9scwnj-shard-00-02.xj4reyt.mongodb.net:27017/university_canteen?ssl=true&replicaSet=atlas-m9cwnj-shard-0&authSource=admin&retryWrites=true&w=majority';

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    // Wait until connection is established or failed
    let waitCount = 0;
    while (mongoose.connection.readyState !== 1 && waitCount < 30) {
      await new Promise((r) => setTimeout(r, 200));
      waitCount++;
    }
    return mongoose.connection;
  }

  isConnecting = true;

  try {
    console.log('[MongoDB] Connecting to Atlas via SRV...');
    const conn = await mongoose.connect(SRV_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (srvErr) {
    console.warn('[MongoDB] SRV failed, trying direct shard replica set...', srvErr.message);
    try {
      const conn = await mongoose.connect(DIRECT_URI, {
        serverSelectionTimeoutMS: 8000
      });
      console.log(`[MongoDB Connected] Host (Direct Shard): ${conn.connection.host}`);
      isConnecting = false;
      return conn;
    } catch (directErr) {
      console.error('[MongoDB] Both connection attempts failed:', directErr.message);
      isConnecting = false;
      throw directErr;
    }
  }
};

module.exports = connectDB;
