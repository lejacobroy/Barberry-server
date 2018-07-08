const Joi = require('joi');
const Datapoint = require('../models/datapoint.model');

module.exports = {

  // GET /v1/datapoints
  listDatapoints: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      windspeed: Joi.number(),
      winddirection: Joi.string(),
      temperature: Joi.number(),
      humidity: Joi.number(),
      barpressure: Joi.number(),
      altitude: Joi.number(),
      daynight: Joi.string(),
    },
  },

  // POST /v1/datapoints
  createDatapoint: {
    body: {
      windspeed: Joi.number(),
      winddirection: Joi.string(),
      temperature: Joi.number(),
      humidity: Joi.number(),
      barpressure: Joi.number(),
      altitude: Joi.number(),
      daynight: Joi.string(),
    },
  },

  // PUT /v1/datapoints/:datapointId
  replaceDatapoint: {
    body: {
      windspeed: Joi.number(),
      winddirection: Joi.string(),
      temperature: Joi.number(),
      humidity: Joi.number(),
      barpressure: Joi.number(),
      altitude: Joi.number(),
      daynight: Joi.string(),
    },
    params: {
      datapointId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/datapoints/:datapointId
  updateDatapoint: {
    body: {
      windspeed: Joi.number(),
      winddirection: Joi.string(),
      temperature: Joi.number(),
      humidity: Joi.number(),
      barpressure: Joi.number(),
      altitude: Joi.number(),
      daynight: Joi.string(),
    },
    params: {
      datapointId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
