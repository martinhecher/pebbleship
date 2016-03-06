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
