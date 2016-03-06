function convertToNumber(str) {
  var arr = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return str.toLowerCase().replace(/[a-z]/ig, function(m) {
    return arr.indexOf(m.toLowerCase())
  });
}

function convertToIdx(cellName) {
  var chars = cellName.split('');
  return [convertToNumber(chars[0]), +chars[1]];
}

module.exports = {
  validateInput: function(cellName, gridBounds) {
      if (cellName.length !== 2) {
        return false;
      }

      var chars = cellName.split('');

      var isLetter = /^[a-zA-Z]$/;
      if (!isLetter.test(chars[0])) {
        console.log('no [a-z]');
        return false;
      }

      // console.log('digit: ' + chars[1]);
      var isDigit = /^\d+$/;
      if (!isDigit.test(chars[1])) {
        console.log('no digit');
        return false;
      }

      var rowIdx = convertToNumber(chars[0]);
      var colIdx = +chars[1];

      if (rowIdx >= gridBounds.x) {
        console.log('out of bounds');
        return false;
      }

      if (colIdx >= gridBounds.y) {
        console.log('out of bounds');
        return false;
      }

      return true;
    },

    convertToIdx: convertToIdx
}
