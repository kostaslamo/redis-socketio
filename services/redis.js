const redis = require("redis");

(async () => {
  const redisClient = redis.createClient({
    url: "redis://localhost:6379",
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
})();
