/**
 * ShotsController
 *
 * @description :: Server-side logic for managing shots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * @api {post} /shots/ Do a shot on the grid
   * @apiVersion 0.1.0
   * @apiName PostShot
   * @apiGroup Shot
   *
   * @apiDescription Do a shot on the grid. This endpoint allows to replay a game for later versions.
   *
   * @apiParam {Number} cell The cell to shoot in the format 'A4'
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *  {
   *    "cell": 'A5',
   *    "hit": true,
	 *    "destroyed": false,
	 *    "id": 1,
   *    "createdAt": "2016-03-06T11:38:25.146Z",
   *    "updatedAt": "2016-03-06T11:38:25.146Z"
   *  }
   */
	create: function(req, res, next) {
		var cell = req.body.cell;

		if (!Pebbleship.hasGrid()) {
      console.log('[pebbleship-server] No grid defined yet, use POST /grid first!');
      return res.send('No grid defined yet, use POST /grid first!').status(500);
    }

		if (!cell || cell.length != 2) {
			console.log('[pebbleship-server] Invalid /shot request for cell: %s', cell);
      return res.send('Please specify the cell to shoot within the grid boundaries like so: "A5" (starting with "A0")').status(500);
    }

		var validationResult = Pebbleship.validateInput(cell);

		if (!validationResult) {
			console.log('[pebbleship-server] Invalid cell format or cell not in grid: %s', cell);
      return res.send('Please specify the cell to shoot within the grid boundaries like so: "A5" (starting with "A0")').status(500);
    }

		var shotResult = Pebbleship.shoot(cell);

		Shots.create(shotResult).then(shot => {
			res.send(shot).status(200);
		});
	}
};
