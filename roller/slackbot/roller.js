'use strict';

// wraps logic around routing
function Roller(config) {
  this.config = config;
}

// add a command
Roller.prototype.roll = function (rolls) {
  return [{roll: '2d4+1', result: 5}];
};

module.exports = Roller;
