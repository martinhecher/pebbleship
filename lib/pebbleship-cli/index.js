var API = require('./binding'),
  readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

var defaults = {
  grid: {
    x: 10,
    y: 10
  },
  ships: [{
    dimension: 4
  }, {
    dimension: 5
  }]
}

var pebbleship = new API({
  host: 'localhost',
  port: 1337
});

function setupDefaultGame() {
  return pebbleship.createGrid(defaults.grid).then(grid => {
    var tasks = [];

    defaults.ships.forEach(ship => {
      tasks.push(pebbleship.createShip(ship));
    });

    return Promise.all(tasks);
  });
}

function gamePrompt() {
  rl.question('shoot> ', function(cellName) {
    pebbleship.shoot({
      cell: cellName
    }).then((result) => {
      // console.log('result: ' + JSON.stringify(result));
      formatOutput(result);
      gamePrompt();
    });
  });
}

function formatOutput(result) {
  result = JSON.parse(result);

  if (result.error) {
    console.log(result.error);
  } else if (result.hit && !result.destroyed) {
    console.log('You hit a vessel but it is still in the water!')
  } else if (result.hit && result.destroyed) {
    console.log('You destroyed a vessel, yeah!')
  } else if (!result.hit) {
    console.log('Shot in the water, nothing hit...');
  }
}

setupDefaultGame().then(() => {
  console.log('[pebbleship-cli] Finished setup.\n\n');
  console.log('Start the game by entering a cell number, e.g., "A3". Have fun!\n\n');

  gamePrompt();
});
