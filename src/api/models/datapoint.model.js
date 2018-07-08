const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');


/**
 * Datapoint Schema
 * @private
 */
const datapointSchema = new mongoose.Schema({

  windspeed: { 
    type: Number,
    default: 0,
    },
  winddirection: { 
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Error'],
    default: 'Error',
    },
  temperature: { 
    type: Number,
    default: 0,
    },
  humidity: { 
    type: Number,
    default: 0,
    },
   barpressure: { 
    type: Number,
    default: 0,
    },
  altitude: { 
    type: Number,
    default: 0,
    },
  daynight: {
    type: String,
    enum: ['Day', 'Night', 'Error'],
    default: 'Error',
  },
}, {
  timestamps: true,
});

 /* email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  services: {
    facebook: String,
    google: String,
  },
  picture: {
    type: String,
    trim: true,
  },
}, {
    timestamps: true,*/


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
datapointSchema.pre('save', async function save(next) {
  try {

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
datapointSchema.method({
  transform() {
    const transformed = {};
    const fields = ['windspeed', 'winddirection', 'temperature', 'humidity', 'barpressure', 'altritude', 'daynight', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
datapointSchema.statics = {



  /**
   * Get datapoint
   *
   * @param {ObjectId} id - The objectId of datapoint.
   * @returns {Promise<Datapoint, APIError>}
   */
  async get(id) {
    try {
      let datapoint;

      if (mongoose.Types.ObjectId.isValid(id)) {
        datapoint = await this.findById(id).exec();
      }
      if (datapoint) {
        return datapoint;
      }

      throw new APIError({
        message: 'Datapoint does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  
  /**
   * List datapoints in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of datapoints to be skipped.
   * @param {number} limit - Limit number of datapoints to be returned.
   * @returns {Promise<Datapoint[]>}
   */
  list({
    page = 1, perPage = 30, createdAt, windspeed,
  }) {
    const options = omitBy({ createdAt, windspeed, }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'createdAt',
          location: 'body',
          messages: ['"createdAt" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

}

/**
 * @typedef Datapoint
 */
module.exports = mongoose.model('Datapoint', datapointSchema);
