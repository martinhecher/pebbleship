/**
 * GridController
 *
 * @description :: Server-side logic for managing grids
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create(req, res, next) {
		var config = {
			x: +req.body.x,
			y: +req.body.y
		}

		if (!config.x || !config.y) {
			console.log('[pebbleship-server] Invalid request: %s', JSON.stringify(config, null, 4));
			return res.send('Please specify the rows and cols of the grid as "x" and "y" in the request!').status(500);
		}

		console.log('[pebbleship-server] Reqesting new grid: %s', JSON.stringify(config, null, 4));

		// Application only supports a single grid at the moment
		Grid.destroy({}).then(() => {
			Grid.create(config).then(grid => {
				console.log('[pebbleship-server] Created new grid, ready to play!');
			})
		});
	}
};
