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

const createSubscriber = (cb) => {
  console.log(`Connecting to Redis ${redisUrl}`);
  const redisClient = redis.createClient({
    url: redisUrl,
  });

  redisClient.duplicate((err, subscriber) => {
    if (err) cb(err);

    redisClient.ping((err, res) => {
      if (err) cb(err);
      else console.log(`REDIS CLIENT: ${res}`);
    });

    subscriber.ping((err, res) => {
      if (err) cb(err);
      else console.log(`REDIS SUBSCRIBER: ${res}`);
    });

    redisClient.set(
      "lastConnectedSubscriber",
      new Date().toISOString(),
      redis.print
    );

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    cb(null, subscriber);
  });
};

module.exports = { createSubscriber };
