var GridBoard = require('./grid'),
  Ship = require('./ship'),
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
  if (cellName.length !== 2) {
    return false;
  }

  var chars = cellName.split('');

  var isLetter = /^[a-zA-Z]$/;
  if (!isLetter.test(chars[0])) {
    console.log('no a-z');
    return false;
  }

  console.log('digit: ' + chars[1]);
  var isDigit = /^\d+$/;
  if (!isDigit.test(chars[1])) {
    console.log('no digit');
    return false;
  }

  var rowIdx = convertToNumber(chars[0]);
  var colIdx = chars[1];

  var gridBounds = this.grid.getBounds();

  if (rowIdx >= gridBounds.x) {
    console.log('out of bounds');
    return false;
  }

  if (colIdx >= gridBounds.y) {
    console.log('out of bounds');
    return false;
  }

  return true;
}

Pebbleship.prototype.shoot = function(cellName) {
  console.log('[pebbleship-server] Shooting cell: ' + cellName);

  var chars = cellName.split('');
  var rowIdx = convertToNumber(chars[0]);
  var colIdx = chars[1];

  var result = this.grid.shoot(rowIdx, colIdx);

  this.grid.dump();

  return {
    cell: cellName,
    alreadyShot: result.alreadyShot,
    hit: result.hit,
    destroyed: result.destroyed
  };
}

function convertToNumber(str) {
  var arr = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return str.toLowerCase().replace(/[a-z]/ig, function(m) {
    return arr.indexOf(m.toLowerCase())
  });
}
