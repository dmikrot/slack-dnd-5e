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
  return { roll: modifiedRoll, total: this.calculate(modifiedRoll) };
};

Roller.prototype.rollAdvantage = function (modifier) {
  return this.rollTwice(modifier, Math.max);
};

Roller.prototype.rollDisadvantage = function (modifier) {
  return this.rollTwice(modifier, Math.min);
};

Roller.prototype.rollTwice = function (mod, reducer) {
  var modifier = mod.charAt(0) === '-' || mod.charAt(0) === '+' ? mod : '+' + mod;
  var roll = '1d20' + this.sanitize(modifier);
  var firstTotal = this.calculate(roll);
  var secondTotal = this.calculate(roll);
  return { roll: roll, total: reducer(firstTotal, secondTotal) };
};

Roller.prototype.sanitize = function (roll) {
  return roll.replace(/[^d\d\+\*\/%)(-]/g, '');
};

Roller.prototype.calculate = function (roll) {
  var rolled;
  if (!roll.length) {
    throw new Error('Can\'t calculate empty roll');
  }
  rolled = roll.replace(/(\d*)d(\d+)/g, function (a, many, die) {
    return this.rollDice(many || 1, die);
  }.bind(this));

  return Math.floor(eval(rolled)); // eslint-disable-line no-eval
};

Roller.prototype.rollDice = function (many, die) {
  var i;
  var value = 0;
  for (i = 0; i < many; ++i) {
    value += Math.floor(Math.random() * die) + 1;
  }
  return value;
};

Roller.prototype.findInvalidRolls = function (rolls) {
  var i;
  var roll;
  var invalidRolls = [];
  for (i = 0; i < rolls.length; ++i) {
    try {
      roll = this.sanitize(rolls[i]);
      this.calculate(roll);
    } catch (e) {
      invalidRolls.push(roll);
    }
  }
  return invalidRolls;
};

module.exports = Roller;
