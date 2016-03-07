//
// Description:
// A ship only knows how often it got hit, allowing it to detect when it has to sink.
// The grid ensures that a ship is not hit twice from the same grid cell. This is a very
// simple mechanism, but allows to not have the ship track its position within the grid
// to know when it is hit.
//
var Ship = module.exports = function(config) {
  this.dimension = +config.dimension;
  this.hitCount = 0;
  this.isDestroyed = false;
};

Ship.prototype.takeHit = function() {
  this.hitCount += 1;

  if (this.hitCount === this.dimension) {
    this.isDestroyed = true;
  }

  return this.isDestroyed;
}
