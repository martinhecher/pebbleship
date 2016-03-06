var GridBoard = require('./grid'),
  Ship = require('./ship'),
  inputHelper = require('./input-helper'),
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
  tasks.push(Ships.destroy({}));
  tasks.push(Shots.destroy({}));

  return Promise.all(tasks);
}

Pebbleship.prototype.createGrid = function(config) {
  this.grid = new GridBoard(config);

  return Grid.create(config).then(grid => {
    return grid;
  });
}

Pebbleship.prototype.placeShip = function(shipConfig) {
  return new Promise((resolve, reject) => {

    var ship = new Ship(shipConfig);

    var success = this.grid.placeShip(ship);

    if (!success) {
      console.log('[pebbleship-server] Grid is too crowded, cannot place this ship. Try with a smaller one!');
      return reject(new Error('Grid is too crowded, cannot place this ship. Try with a smaller one!'));
    }

    // Show new grid config on screen:
    this.grid.dump();

    Ships.create(ship).then(ship => {
      console.log('[pebbleship-server] added new ship!');
      return resolve(ship);
    });
  });
}

Pebbleship.prototype.validateInput = function(cellName) {
  var gridBounds = this.grid.getBounds();
  return inputHelper.validateInput(cellName, gridBounds);
}

Pebbleship.prototype.shoot = function(cellName) {
  console.log('[pebbleship-server] Shooting cell: ' + cellName);

  var idx = inputHelper.convertToIdx(cellName);

  var result = this.grid.shoot(idx[0], idx[1]);

  this.grid.dump();

  return {
    cell: cellName,
    alreadyShot: result.alreadyShot,
    hit: result.hit,
    destroyed: result.destroyed
  };
}
