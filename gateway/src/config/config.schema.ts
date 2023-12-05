import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  TZ: Joi.string().default('UTC'),
  APP_NAME: Joi.string().default('TASK MANAGEMENT API'),
  API_GATEWAY_PORT: Joi.number().default(3000),
  API_GATEWAY_HOST: Joi.string().default('gateway'),
  WEB_LINK: Joi.string().default('http://localhost'),
  USER_SERVICE_PORT: Joi.number().default(3001),
  USER_SERVICE_HOST: Joi.string().default('localhost'),
  TASK_SERVICE_PORT: Joi.number().default(3002),
  TASK_SERVICE_HOST: Joi.string().default('localhost'),
});
