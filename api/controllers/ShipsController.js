/**
 * ShipsController
 *
 * @description :: Server-side logic for managing ships
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * @api {post} /ships/ Create new ship
   * @apiVersion 0.1.0
   * @apiName PostShips
   * @apiGroup Ships
   *
   * @apiDescription Places a ship with the given dimension on the grid. The placing
   * algorithm is choosing the rotation of the ship on the grid and is not controllable
   * by the user.
   *
   * @apiParam {Number} dimension Ship dimension.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *  {
   *    "dimension": 5,
   *    "createdAt": "2016-03-06T11:38:25.146Z",
   *    "updatedAt": "2016-03-06T11:38:25.146Z"
   *  }
   */
  create: function(req, res, next) {
    var config = {
      dimension: req.body.dimension
    };

    if (!config.dimension || config.dimension <= 0) {
      console.log('[pebbleship-server] Invalid /ships request: %s', JSON.stringify(config, null, 4));
      return res.send('Please specify the "dimension" of a ship, which has to be an integer < 0!').status(500);
    }

    Pebbleship.placeShip(config).then(ship => {
      res.send(ship).status(200);
    }).catch(err => {
      console.log('[pebbleship-server] ShipsController: ' + err);

      return res.send({
        errorText: err.message
      }).status(500);
    })

  }

  /**
   * @api {get} /ships/:id Get ship configs
   * @apiVersion 0.1.0
   * @apiName GetShips
   * @apiGroup Ships
   *
   * @apiDescription Returns the current ship configurations.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *  {
   *    "dimension": 5,
   *    "id": 1,
   *    "createdAt": "2016-03-06T11:38:25.146Z",
   *    "updatedAt": "2016-03-06T11:38:25.146Z"
   *  }
   */
};
