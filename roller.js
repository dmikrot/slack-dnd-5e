/* eslint-disable class-methods-use-this */
class Roller {
  rollAll(rolls) {
    return rolls.map(this.roll.bind(this));
  }

  roll(roll) {
    const modifiedRoll = this.sanitize(roll);
    return { roll: modifiedRoll, total: this.calculate(modifiedRoll) };
  }

  rollAdvantage(modifier) {
    return this.rollTwice(modifier, Math.max);
  }

  rollDisadvantage(modifier) {
    return this.rollTwice(modifier, Math.min);
  }

  rollTwice(mod, reducer) {
    const modifier = mod.charAt(0) === '-' || mod.charAt(0) === '+' ? mod : `+${mod}`;
    const roll = `1d20${this.sanitize(modifier)}`;
    const firstTotal = this.calculate(roll);
    const secondTotal = this.calculate(roll);
    return { roll, total: reducer(firstTotal, secondTotal) };
  }

  sanitize(roll) {
    return roll.replace(/[^d\d+*/%)(-]/g, '');
  }

  calculate(roll) {
    if (!roll.length) {
      throw new Error('Can\'t calculate empty roll');
    }
    const rolled = roll.replace(/(\d*)d(\d+)/g, (a, many, die) => this.rollDice(many || 1, die));

    return Math.floor(eval(rolled)); // eslint-disable-line no-eval
  }

  rollDice(many, die) {
    let i;
    let value = 0;
    for (i = 0; i < many; i += 1) {
      value += Math.floor(Math.random() * die) + 1;
    }
    return value;
  }

  findInvalidRolls(rolls) {
    return rolls
      .map(roll => this.sanitize(roll))
      .filter((roll) => {
        try {
          this.calculate(roll);
          return false;
        } catch (e) {
          return true;
        }
      });
  }
}

module.exports = Roller;
