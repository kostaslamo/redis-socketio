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

const createPublisher = async () => {
  try {
    console.log(`Connecting to Redis ${redisUrl}`);

    const redisClient = redis.createClient({
      url: redisUrl,
    });

    const publisher = redisClient.duplicate();

    await redisClient.connect();
    await publisher.connect();

    redisClient
      .ping()
      .then((res) => console.log(`REDIS CLIENT: ${res}`))
      .catch((err) => console.log(err));

    publisher
      .ping()
      .then((res) => console.log(`REDIS PUBLISHER: ${res}`))
      .catch((err) => console.log(err));

    redisClient.set(
      "lastConnectedPublisher",
      new Date().toISOString(),
      redis.print
    );

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    return publisher;
  } catch (e) {
    console.log(`REDIS ERROR: ${e.message}`);
  }
};

module.exports = { createPublisher };
