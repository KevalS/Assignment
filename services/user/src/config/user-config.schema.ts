import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  USER_SERVICE_PORT: Joi.number().default(3001),
  USER_SERVICE_DB_HOST: Joi.string().default('127.0.0.1'),
  USER_SERVICE_DB_PORT: Joi.number().default(3306),
  USER_SERVICE_DB_NAME: Joi.string().default('taskManagement-user'),
  USER_SERVICE_DB_USERNAME: Joi.string().default('root'),
  USER_SERVICE_DB_PASSWORD: Joi.string().default('Dkod3@123'),
  JWT_SECRET: Joi.string().default('qwertyuiop'),
  TZ: Joi.string().default('UTC'),
  WEB_LINK: Joi.string().default('http://localhost'),
  JWT_EXP_TIME: Joi.string().default('24h'), // 24 hours
  TASK_SERVICE_PORT: Joi.number().default(3002),
  TASK_SERVICE_HOST: Joi.string().default('localhost'),
});
