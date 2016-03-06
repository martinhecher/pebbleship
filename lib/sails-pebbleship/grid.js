var Grid = module.exports = function(config) {
  this.grid = this.initializeGrid(config);
};

Grid.prototype.initializeGrid = function(config) {
  var grid = [];

  for (var rowIdx = 0; rowIdx < config.y; rowIdx++) {
    // Metadata for each row contains an array of free, connected cells
    var row = {
      freeBlocks: [{
        start: 0,
        dimension: config.x
      }],
      cells: []
    };
    grid.push(row);

    for (var colIdx = 0; colIdx < config.x; colIdx++) {
      row.cells.push({
        ship: null
      });
    }
  }

  return grid;
}

Grid.prototype.placeShip = function(ship) {
  //
  // 1. get all rows containing enough space for the ship:
  //
  var candidateRows = this.getFreeRowsFor(ship);

  // console.log('\n\nSuitable rows: ' + candidateRows.length);

  if (!candidateRows.length) {
    return false;
  }

  //
  // 2. Randomly select a candiate row:
  //
  var rowIdx = Math.floor(Math.random() * candidateRows.length);

  // console.log('Randomly selected grid row: ' + rowIdx);

  //
  // 3. Get possible free blocks from this row and place the ship randomly there:
  //
  var blocks = candidateRows[rowIdx].freeBlocks;

  // console.log('Free blocks in this row: ' + JSON.stringify(blocks, null, 4));

  var initialBlockIdx = Math.floor(Math.random() * blocks.length);
  var blockIdx = this.fitShipIntoFreeBlock(ship, blocks, initialBlockIdx);

  var block = blocks[blockIdx];

  //
  // 4. Randomly select a cell in the free block and place ship:
  //
  var freeCellIdxInFreeBlock = Math.floor(Math.random() * (block.dimension - ship.dimension + 1));

  // console.log('Randomly selecting a cell in the free block to place ship. Cell: ' + freeCellIdxInFreeBlock);
  var cellIdx = block.start + freeCellIdxInFreeBlock;

  // console.log('    ... which corresponds to cell %s in row.', cellIdx);

  for (var idx = 0; idx < ship.dimension; idx++) {
    var cell = candidateRows[rowIdx].cells[cellIdx + idx];
    cell.ship = ship;
  }

  //
  // 5. Update free blocks in row:
  //
  var newBlocks = [];

  if (freeCellIdxInFreeBlock === 0 && block.dimension > ship.dimension) {
    newBlocks.push({
      start: ship.dimension + block.start,
      dimension: block.dimension - ship.dimension
    });
  } else {

    if (freeCellIdxInFreeBlock > 0) { // cells left free before
      newBlocks.push({
        start: block.start,
        dimension: freeCellIdxInFreeBlock
      });

      var hasCellsAfter = freeCellIdxInFreeBlock + ship.dimension < block.dimension;
      // console.log('hasCellsAfter: ' + hasCellsAfter);
      if (hasCellsAfter) {
        newBlocks.push({
          start: freeCellIdxInFreeBlock + ship.dimension + block.start,
          dimension: block.dimension - freeCellIdxInFreeBlock - ship.dimension
        });
      }
    } else { // cells left free after
      newBlocks.push({
        start: freeCellIdxInFreeBlock + ship.dimension,
        dimension: block.dimension - ship.dimension
      });
    }
  }

  blocks.splice(blockIdx, 1);

  newBlocks.forEach(block => {
    blocks.push(block);
  });

  // console.log('Updatied free blocks in row: ' + JSON.stringify(blocks, null, 4));

  this.dump();

  return true;
}

Grid.prototype.fitShipIntoFreeBlock = function(config, blocks, seed) {
  // console.log('Iterating through free blocks randomly beginning at block: ' + seed);

  if (seed >= blocks.length) {
    seed = seed % blocks.length;
  }

  var block = blocks[seed];

  if (block.dimension >= config.dimension) {
    // console.log('Block %s has enough space, selected!', seed);
    return seed;
  } else {
    seed += 1;
    // console.log('Block %s has NOT enough space, trying next one:', seed);
    return this.fitShipIntoFreeBlock(config, blocks, seed)
  }
}

Grid.prototype.getFreeRowsFor = function(config) {
  var result = this.grid.filter(row => {
    var hasEnoughSpace = false;
    // console.log('row: ' + JSON.stringify(row, null, 4));
    row.freeBlocks.forEach(block => {
      // console.log('block: ' + JSON.stringify(block, null, 4));
      if (block.dimension >= config.dimension) {
        hasEnoughSpace = true;
      }
      // console.log('      hasEnoughSpace: ' + hasEnoughSpace);
    })
    return hasEnoughSpace;
  });

  return result;
};

Grid.prototype.dump = function() {
  this.grid.forEach(row => {
    var displayLine = '|';
    row.cells.forEach(cell => {
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
