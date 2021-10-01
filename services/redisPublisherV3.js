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

const createPublisher = (cb) => {
  console.log(`Connecting to Redis ${redisUrl}`);

  const redisClient = redis.createClient({
    url: redisUrl,
  });

  redisClient.duplicate((err, publisher) => {
    if (err) return cb(err);

    redisClient.ping((err, res) => {
      if (err) return cb(err);
      else console.log(`REDIS CLIENT: ${res}`);
    });

    publisher.ping((err, res) => {
      if (err) return cb(err);
      else console.log(`REDIS PUBLISHER: ${res}`);
    });

    redisClient.set(
      "lastConnectedPublisher",
      new Date().toISOString(),
      redis.print
    );

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    return cb(null, publisher);
  });
};

module.exports = { createPublisher };
