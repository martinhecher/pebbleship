var PlacementLogic = require('./placement-logic');

var Grid = module.exports = function(config) {
  this.grid = this.initializeGrid(config);
  this.placementLogic = new PlacementLogic(this.grid, config);
};

Grid.prototype.initializeGrid = function(config) {
  var grid = [];

  for (var rowIdx = 0; rowIdx < config.y; rowIdx++) {
    var row = [];
    grid.push(row);

    for (var colIdx = 0; colIdx < config.x; colIdx++) {
      row.push({
        ship: null
      });
    }
  }

  return grid;
}

Grid.prototype.placeShip = function(ship) {
  var success = this.placementLogic.placeShip(ship);

  this.dump();
  
  return success;
}

Grid.prototype.dump = function() {
  this.grid.forEach(row => {
    var displayLine = '|';
    row.forEach(cell => {
      if (cell.ship) {
        displayLine += 'O';
      } else {
        displayLine += '.';
      }
    });

    displayLine += '|';
    console.log(displayLine);
  });
};
