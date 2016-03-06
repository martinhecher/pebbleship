var Grid = module.exports = function(config) {
  this.gridHorizontal = this.initializeGrid(config);
  this.gridVertical = this.transposeGrid(this.gridHorizontal, config);
  this.freeLinesHorizontal = this.initializeFreeLines(this.gridHorizontal, config);
  this.freeLinesVertical = this.initializeFreeLines(this.gridVertical, config, true);
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

Grid.prototype.transposeGrid = function(grid, config) {
  var transposedGrid = this.initializeGrid({
    x: config.y,
    y: config.x
  });

  grid.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      transposedGrid[colIdx][rowIdx] = grid[rowIdx][colIdx];
    });
  });

  return transposedGrid;
}

Grid.prototype.initializeFreeLines = function(grid, config, transposed) {
  var metadata = [],
    dimension = (transposed) ? config.x : config.y;

  for (var idx = 0; idx < dimension; idx++) {
    // Metadata for each row contains an array of free, connected cells
    var line = {
      freeBlocks: [{
        start: 0,
        dimension: dimension
      }],
      cells: grid[idx]
    };
    metadata.push(line);
  }

  return metadata;
}

Grid.prototype.placeShip = function(ship) {
  //
  // 0. Randomly pick orientation:
  //
  var freeLinesMetadata = Math.random() < 0.5 ? this.freeLinesHorizontal : this.freeLinesVertical;

  //
  // 1. get all rows containing enough space for the ship:
  //
  var candidateRows = this.getFreeLinesFor(ship, this.freeLinesHorizontal);

  // console.log('\n\nSuitable rows: ' + candidateRows.length);

  if (!candidateRows.length) {
    return false;
  }

  //
  // 2. Randomly select a candiate cell line:
  //
  var lineIdx = Math.floor(Math.random() * candidateRows.length);

  // console.log('Randomly selected grid row: ' + lineIdx);

  //
  // 3. Get possible free blocks from this row and place the ship randomly there:
  //
  var blocks = candidateRows[lineIdx].freeBlocks;

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
    var cell = candidateRows[lineIdx].cells[cellIdx + idx];
    cell.ship = ship;
  }

  //
  // 5. Update free blocks in current freeLines metadata block:
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

  // this.updateFreeLinesMetadata(freeLinesMetadata, lineIdx);

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

Grid.prototype.getFreeLinesFor = function(ship, freeMetadata) {
  var result = freeMetadata.filter(line => {
    var hasEnoughSpace = false;
    // console.log('row: ' + JSON.stringify(row, null, 4));
    line.freeBlocks.forEach(block => {
      // console.log('block: ' + JSON.stringify(block, null, 4));
      if (block.dimension >= ship.dimension) {
        hasEnoughSpace = true;
      }
      // console.log('      hasEnoughSpace: ' + hasEnoughSpace);
    })
    return hasEnoughSpace;
  });

  return result;
};

Grid.prototype.updateFreeLinesMetadata = function(freeLinesMetadata, lineIdx) {
  console.log('Updating lines');

}

Grid.prototype.dump = function() {
  this.gridHorizontal.forEach(row => {
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

  console.log('\n\n');

  this.gridVertical.forEach(row => {
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
