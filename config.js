const redisUsername = process.env.REDIS_USERNAME;
const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisLocal = process.env.REDIS_LOCAL === "true";

module.exports = {
  redisUsername,
  redisPassword,
  redisHost,
  redisPort,
  redisLocal,
};
