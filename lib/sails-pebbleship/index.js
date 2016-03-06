var GridBoard = require('./grid'),
  Promise = require('bluebird');

var Pebbleship = module.exports = function() {
  this.grid = null;
}

Pebbleship.prototype.hasGrid = function() {
  return this.grid;
}

Pebbleship.prototype.reset = function() {
  var tasks = [];
  tasks.push(Grid.destroy({}));

  return Promise.all(tasks);
}

Pebbleship.prototype.createGrid = function(config) {
  this.grid = new GridBoard(config);
  // console.log('grid: ' + JSON.stringify(this.grid, null, 4));
  return Grid.create(config).then(grid => {
    return grid;
  });
}

Pebbleship.prototype.placeShip = function(shipConfig) {
  return new Promise((resolve, reject) => {

    // var ship = new Ship(shipConfig);
    var ship = shipConfig;

    var success = this.grid.placeShip(ship);

    if (!success) {
      console.log('[pebbleship-server] Grid is too crowded, cannot place this ship. Try with a smaller one!');
      return reject(new Error('Grid is too crowded, cannot place this ship. Try with a smaller one!'));
    }

    Ships.create(ship).then(ship => {
      console.log('[pebbleship-server] added new ship!');
      return resolve(ship);
    });
  });
}
