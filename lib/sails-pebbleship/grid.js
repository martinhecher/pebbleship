var PlacementLogic = require('./placement-logic');

var Grid = module.exports = function(config) {
  this.grid = this.initializeGrid(config);
  this.placementLogic = new PlacementLogic(this.grid, config);
  this.bounds = config;
};

Grid.prototype.getBounds = function() {
  return this.bounds;
}

Grid.prototype.initializeGrid = function(config) {
  var grid = [];

  for (var rowIdx = 0; rowIdx < config.y; rowIdx++) {
    var row = [];
    grid.push(row);

    for (var colIdx = 0; colIdx < config.x; colIdx++) {
      row.push({
        ship: null,
        hit: false
      });
    }
  }

  return grid;
}

Grid.prototype.placeShip = function(ship) {
  return this.placementLogic.placeShip(ship);
}

Grid.prototype.shoot = function(rowIdx, colIdx) {
  console.log('shooting at: %s | %s', rowIdx, colIdx);

  console.log('ship: ' + this.grid[rowIdx][colIdx]);

  var cell = this.grid[rowIdx][colIdx];

  if (!cell.hit) {
    // Note: this is to prevent multiple shots on the same cell internally as the
    // ship does not take into account where it was hit, only how often.
    cell.hit = true;

    if (cell.ship) {
      var isDestroyed = cell.ship.takeHit();

      return {
        alreadyShot: false,
        hit: true,
        destroyed: isDestroyed
      }
    }
  }

  return {
    alreadyShot: true,
    hit: false,
    destroyed: false
  }
}

Grid.prototype.dump = function() {
  this.grid.forEach(row => {
    var displayLine = '|';
    row.forEach(cell => {
      if (cell.hit) {
        displayLine += 'x';
      } else {
        if (cell.ship) {
          displayLine += 'O';
        } else {
          displayLine += '.';
        }
      }
    });

    displayLine += '|';
    console.log(displayLine);
  });
};
