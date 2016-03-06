/**
 * GridController
 *
 * @description :: Server-side logic for managing grids
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * @api {post} /grid/ Create grid
   * @apiVersion 0.1.0
   * @apiName PostGrid
   * @apiGroup Grid
   *
   * @apiDescription Create a new grid (x,y). The game is reset internally.
   *
   * @apiParam {Number} x Number of grid columns
   * @apiParam {Number} y Number of grid rows
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
	 *  {
	 *    "x": 10,
	 *    "y": 10,
	 *    "id": 1,
	 *    "createdAt": "2016-03-06T11:38:25.146Z",
	 *    "updatedAt": "2016-03-06T11:38:25.146Z"
	 *  }
   */
  create(req, res, next) {
    var config = {
      x: +req.body.x,
      y: +req.body.y,
      id: 1 // Application only supports a single grid, creating a new grid resets the whole game
    }

    if (!config.x || !config.y) {
      console.log('[pebbleship-server] Invalid request: %s', JSON.stringify(config, null, 4));
      return res.send('Please specify the rows and cols of the grid as "x" and "y" in the request!').status(500);
    }

    console.log('[pebbleship-server] Reqesting new grid: %s', JSON.stringify(config, null, 4));

    Pebbleship.reset().then(() => {
      Pebbleship.createGrid(config).then(grid => {
        console.log('[pebbleship-server] Created new grid, ready to play!');
        return res.send(grid).status(200);
      })
    }).catch(err => {
			console.log('[pebbleship-server] GridController: ' + err.stack);

			return res.send({
				errorText: err.message
			}).status(500);
    });
  }
};
