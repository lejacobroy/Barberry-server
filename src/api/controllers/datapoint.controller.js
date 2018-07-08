const httpStatus = require('http-status');
const { omit } = require('lodash');
const Datapoint = require('../models/datapoint.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load datapoint and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const datapoint = await Datapoint.get(id);
    req.locals = { datapoint };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get datapoint
 * @public
 */
exports.get = (req, res) => res.json(req.locals.datapoint.transform());

/**
 * Get logged in datapoint info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.datapoint.transform());

/**
 * Create new datapoint
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const datapoint = new Datapoint(req.body);
    const savedDatapoint = await datapoint.save();
    res.status(httpStatus.CREATED);
    res.json(savedDatapoint.transform());
  } catch (error) {
    next(Datapoint.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing datapoint
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { datapoint } = req.locals;
    const newDatapoint = new Datapoint(req.body);
    const ommitRole = datapoint.role !== 'admin' ? 'role' : '';
    const newDatapointObject = omit(newDatapoint.toObject(), '_id', ommitRole);

    await datapoint.update(newDatapointObject, { override: true, upsert: true });
    const savedDatapoint = await Datapoint.findById(datapoint._id);

    res.json(savedDatapoint.transform());
  } catch (error) {
    next(Datapoint.checkDuplicateEmail(error));
  }
};

/**
 * Update existing datapoint
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.datapoint.role !== 'admin' ? 'role' : '';
  const updatedDatapoint = omit(req.body, ommitRole);
  const datapoint = Object.assign(req.locals.datapoint, updatedDatapoint);

  datapoint.save()
    .then(savedDatapoint => res.json(savedDatapoint.transform()))
    .catch(e => next(Datapoint.checkDuplicateEmail(e)));
};

/**
 * Get datapoint list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const datapoints = await Datapoint.list(req.query);
    const transformedDatapoints = datapoints.map(datapoint => datapoint.transform());
    res.json(transformedDatapoints);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete datapoint
 * @public
 */
exports.remove = (req, res, next) => {
  const { datapoint } = req.locals;

  datapoint.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
