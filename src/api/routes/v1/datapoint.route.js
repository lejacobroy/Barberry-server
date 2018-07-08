const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/datapoint.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listDatapoints,
  createDatapoint,
  replaceDatapoint,
  updateDatapoint,
} = require('../../validations/datapoint.validation');

const router = express.Router();

/**
 * Load datapoint when API with datapointId route parameter is hit
 */
router.param('datapointId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/datapoints List Datapoints
   * @apiDescription Get a list of datapoints
   * @apiVersion 1.0.0
   * @apiName ListDatapoints
   * @apiGroup Datapoint
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Datapoint's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Datapoints per page
   * @apiParam  {String}             [name]       Datapoint's name
   * @apiParam  {String}             [email]      Datapoint's email
   * @apiParam  {String=datapoint,admin}  [role]       Datapoint's role
   *
   * @apiSuccess {Object[]} datapoints List of datapoints.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated datapoints can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(listDatapoints), controller.list)
  /**
   * @api {post} v1/datapoints Create Datapoint
   * @apiDescription Create a new datapoint
   * @apiVersion 1.0.0
   * @apiName CreateDatapoint
   * @apiGroup Datapoint
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Datapoint's access token
   *
   * @apiParam  {String}             email     Datapoint's email
   * @apiParam  {String{6..128}}     password  Datapoint's password
   * @apiParam  {String{..128}}      [name]    Datapoint's name
   * @apiParam  {String=datapoint,admin}  [role]    Datapoint's role
   *
   * @apiSuccess (Created 201) {String}  id         Datapoint's id
   * @apiSuccess (Created 201) {String}  name       Datapoint's name
   * @apiSuccess (Created 201) {String}  email      Datapoint's email
   * @apiSuccess (Created 201) {String}  role       Datapoint's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated datapoints can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createDatapoint), controller.create);


router
  .route('/:datapointId')
  /**
   * @api {get} v1/datapoints/:id Get Datapoint
   * @apiDescription Get datapoint information
   * @apiVersion 1.0.0
   * @apiName GetDatapoint
   * @apiGroup Datapoint
   * @apiPermission datapoint
   *
   * @apiHeader {String} Athorization  Datapoint's access token
   *
   * @apiSuccess {String}  id         Datapoint's id
   * @apiSuccess {String}  name       Datapoint's name
   * @apiSuccess {String}  email      Datapoint's email
   * @apiSuccess {String}  role       Datapoint's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated datapoints can access the data
   * @apiError (Forbidden 403)    Forbidden    Only datapoint with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Datapoint does not exist
   */
  .get(controller.get)
  /**
   * @api {put} v1/datapoints/:id Replace Datapoint
   * @apiDescription Replace the whole datapoint document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDatapoint
   * @apiGroup Datapoint
   * @apiPermission datapoint
   *
   * @apiHeader {String} Athorization  Datapoint's access token
   *
   * @apiParam  {String}             email     Datapoint's email
   * @apiParam  {String{6..128}}     password  Datapoint's password
   * @apiParam  {String{..128}}      [name]    Datapoint's name
   * @apiParam  {String=datapoint,admin}  [role]    Datapoint's role
   * (You must be an admin to change the datapoint's role)
   *
   * @apiSuccess {String}  id         Datapoint's id
   * @apiSuccess {String}  name       Datapoint's name
   * @apiSuccess {String}  email      Datapoint's email
   * @apiSuccess {String}  role       Datapoint's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated datapoints can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only datapoint with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Datapoint does not exist
   */
  .put(validate(replaceDatapoint), controller.replace)
  /**
   * @api {patch} v1/datapoints/:id Update Datapoint
   * @apiDescription Update some fields of a datapoint document
   * @apiVersion 1.0.0
   * @apiName UpdateDatapoint
   * @apiGroup Datapoint
   * @apiPermission datapoint
   *
   * @apiHeader {String} Athorization  Datapoint's access token
   *
   * @apiParam  {String}             email     Datapoint's email
   * @apiParam  {String{6..128}}     password  Datapoint's password
   * @apiParam  {String{..128}}      [name]    Datapoint's name
   * @apiParam  {String=datapoint,admin}  [role]    Datapoint's role
   * (You must be an admin to change the datapoint's role)
   *
   * @apiSuccess {String}  id         Datapoint's id
   * @apiSuccess {String}  name       Datapoint's name
   * @apiSuccess {String}  email      Datapoint's email
   * @apiSuccess {String}  role       Datapoint's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated datapoints can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only datapoint with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Datapoint does not exist
   */
  .patch(validate(updateDatapoint), controller.update)
  /**
   * @api {patch} v1/datapoints/:id Delete Datapoint
   * @apiDescription Delete a datapoint
   * @apiVersion 1.0.0
   * @apiName DeleteDatapoint
   * @apiGroup Datapoint
   * @apiPermission datapoint
   *
   * @apiHeader {String} Athorization  Datapoint's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated datapoints can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only datapoint with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Datapoint does not exist
   */
  .delete(controller.remove);


module.exports = router;
