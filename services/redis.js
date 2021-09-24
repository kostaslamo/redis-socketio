const redis = require("redis");
const {
  redisLocal,
  redisUsername,
  redisPassword,
  redisHost,
  redisPort,
} = require("../config");

const redisUrl = redisLocal
  ? "redis://localhost:6379"
  : `redis://${redisUsername}:${redisPassword}@${redisHost}:${redisPort}`;

(async () => {
  try {
    console.log(`Connecting to Redis ${redisUrl}`);

    const redisClient = redis.createClient({
      url: redisUrl,
    });

    const subscriber = redisClient.duplicate();

    await redisClient.connect();
    await subscriber.connect();

    redisClient
      .ping()
      .then((res) => console.log(`REDIS CLIENT: ${res}`))
      .catch((err) => console.log(err));

    subscriber
      .ping()
      .then((res) => console.log(`REDIS SUBSCRIBER: ${res}`))
      .catch((err) => console.log(err));

    redisClient.on("error", (err) => console.log("Redis Client Error", err));
  } catch (e) {
    console.log(`REDIS ERROR: ${e.message}`);
  }
})();
