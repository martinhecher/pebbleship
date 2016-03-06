/**
 * Ships.js
 */

module.exports = {

  attributes: {
    // public properties
    dimension: 'integer',

    // private properties
    x: 'integer',
    y: 'integer',
    orientation: 'string',

    toJSON: function() {
      var obj = this.toObject();
      delete obj.x;
      delete obj.y;
      delete obj.orientation;

      return obj;
    }
  }
};
