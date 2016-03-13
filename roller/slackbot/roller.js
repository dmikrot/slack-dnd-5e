'use strict';

// wraps logic around routing
function Roller(config) {
  this.config = config;
}

// add a command
Roller.prototype.rollAll = function (rolls) {
  return rolls.map(this.roll.bind(this));
};

Roller.prototype.roll = function (roll) {
  var modifiedRoll = this.sanitize(roll);
  return { roll: modifiedRoll, result: this.calculate(roll) };
};

Roller.prototype.sanitize = function (roll) {
  return roll.replace(/[^d\d\+\*%)(-]/g, '');
};

Roller.prototype.calculate = function (roll) {
  return eval(roll.replace(/(\d?)d(\d+)/g, function (a, many, die) { // eslint-disable-line no-eval
    return this.rollDice(many || 1, die);
  }.bind(this)));
};

Roller.prototype.rollDice = function (many, die) {
  var i;
  var value = 0;
  for (i = 0; i < many; ++i) {
    value += Math.floor(Math.random() * die) + 1;
  }
  return value;
};

module.exports = Roller;
