var Grid = module.exports = function(config) {
  this.grid = this.initializeGrid(config);
  this.freeLinesHorizontal = this.initializeFreeLines(this.grid, config);
  this.freeLinesVertical = this.initializeFreeLines(this.grid, config, true);
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

Grid.prototype.initializeFreeLines = function(grid, config, vertical) {
  var metadata = [],
    dimension = (vertical) ? config.x : config.y;

  for (var idx = 0; idx < dimension; idx++) {
    var cells = [];

    if (vertical) {
      grid.forEach(row => {
        cells.push(row[idx])
      });
    } else {
      cells = grid[idx];
    }
    // Metadata for each row contains an array of free, connected cells
    var line = {
      freeBlocks: [{
        start: 0,
        dimension: dimension
      }],
      cells: cells
    };
    metadata.push(line);
  }

  return metadata;
}

Grid.prototype.placeShip = function(ship, vertical) {
  //
  // 0. Randomly pick orientation:
  //
  var vertical = Math.random() < 0.5;
  var freeLinesMetadata = (vertical) ? this.freeLinesVertical : this.freeLinesHorizontal;

  console.log('Vertical placement: ' + vertical);

  //
  // 1. get all rows containing enough space for the ship:
  //
  var candidateLines = this.getFreeLinesFor(ship, freeLinesMetadata);

  // console.log('\n\nSuitable rows: ' + candidateLines.length);

  if (!candidateLines.length) {
    // FIXXME: There is the possibility that if a vertical placemet is not
    // possible a horizontal would still have free places. This case has to be
    // handled here instead of simply bailing out! For this demo I leafe it with
    // this explanation, though.
    return false;
  }

  //
  // 2. Randomly select a candiate cell line:
  //
  var lineIdx = Math.floor(Math.random() * candidateLines.length);

  // console.log('Randomly selected grid row: ' + lineIdx);

  //
  // 3. Get possible free blocks from this row and place the ship randomly there:
  //
  var blocks = candidateLines[lineIdx].freeBlocks;

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

  var affectedLines = [];

  for (var idx = 0; idx < ship.dimension; idx++) {
    var cell = candidateLines[lineIdx].cells[cellIdx + idx];
    cell.ship = ship;
    affectedLines.push(cellIdx + idx);
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

  this.updateFreeLinesMetadata(affectedLines, vertical);

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

// Usecase: If a ship was inserted horizontally, the free space information for
// vertical placement has to be updated and vice versa. This method is taking care
// of updating the metadata based on the current data in the grid.
Grid.prototype.updateFreeLinesMetadata = function(affectedLines, vertical) {
  var freeMetadataToUpdate = (vertical) ? this.freeLinesHorizontal : this.freeLinesVertical;

  //
  // 1. Get ground truth lines from grid:
  //

  console.log('affectedLines: ' + JSON.stringify(affectedLines, null, 4));

  affectedLines.forEach(lineIdx => {
    var gridLine = [];

    if (vertical) {
      gridLine = this.grid[lineIdx];
    } else {
      this.grid.forEach(row => {
        gridLine.push(row[lineIdx]);
      });
    }

    //
    // 2. Construct freeBlocks data from line and update freeMetadata structure:
    //
    var blocks = [],
      currentFreeBlock = null,
      dimension = 0;

    gridLine.forEach((cell, idx) => {
      // console.log('idx: %s | ship: %s', idx, cell.ship);

      if (!cell.ship) {
        if (currentFreeBlock) {
          // console.log('adding dimension: ' + idx);
          currentFreeBlock.dimension += 1;
        } else {
          // console.log('creating new free block at idx: ' + idx);
          currentFreeBlock = {
            start: idx,
            dimension: 1
          }
        }
      } else {
        if (currentFreeBlock) {
          // console.log('writing block');
          blocks.push(currentFreeBlock);
          currentFreeBlock = null;
        }
      }
    });

    if (currentFreeBlock) {
      // console.log('writing final free block');
      blocks.push(currentFreeBlock);
    }

    console.log('new free blocks: ' + JSON.stringify(blocks, null, 4));
    // console.log('gridLine: ' + JSON.stringify(gridLine, null, 4));

    freeMetadataToUpdate[lineIdx].freeBlocks = blocks;
  });

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
