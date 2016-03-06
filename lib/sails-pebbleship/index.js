var Promise = require('bluebird');

var Pebbleship = module.exports = function() {};

Pebbleship.prototype.reset = function() {
  var tasks = [];
  tasks.push(Grid.destroy({}));

  return Promise.all(tasks);
}

Pebbleship.prototype.createGrid = function(config) {
  return Grid.create(config);
}
