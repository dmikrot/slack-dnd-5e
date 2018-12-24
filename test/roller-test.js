/* global describe it */
const chai = require('chai');
const Roller = require('../roller');

const { expect } = chai;
const roller = new Roller();

chai.use(require('dirty-chai'));

describe('roller', () => {
  const assertResult = (result, roll, min, max) => {
    expect(result).to.have.property('roll');
    expect(result).to.have.property('total');
    expect(result.roll).to.eq(roll);
    if (max !== undefined) {
      expect(result.total).to.be.within(min, max);
    } else {
      expect(result.total).to.eq(min);
    }
  };

  it('assumes a single dice if how many to roll is missing', () => {
    const result = roller.roll('d4');

    assertResult(result, 'd4', 1, 4);
  });

  it('can add', () => {
    const result = roller.roll('1d4+4');

    assertResult(result, '1d4+4', 5, 8);
  });

  it('can multiply', () => {
    const result = roller.roll('1d4*2');

    assertResult(result, '1d4*2', 2, 8);
  });

  it('can subtract', () => {
    const result = roller.roll('1d4-1');

    assertResult(result, '1d4-1', 0, 3);
  });

  it('can divide', () => {
    const result = roller.roll('1d10/2');

    assertResult(result, '1d10/2', 0, 5);
  });

  it('can modulo', () => {
    const result = roller.roll('1d10%2');

    assertResult(result, '1d10%2', 0, 1);
  });

  it('rounds down', () => {
    const result = roller.roll('9/2');

    assertResult(result, '9/2', 4);
  });

  it('can roll many dice', () => {
    const result = roller.roll('100d4');

    assertResult(result, '100d4', 100, 400);
  });

  it('gives random results', () => {
    const firstResult = roller.roll('10d10000');
    const secondResult = roller.roll('10d10000');

    assertResult(firstResult, '10d10000', 10, 100000);
    assertResult(secondResult, '10d10000', 10, 100000);
    expect(firstResult.total).to.not.eq(secondResult.total);
  });

  it('sanitizes unexpected characters', () => {
    const result = roller.roll(';eval(10.0[d]4+&2!0)');

    assertResult(result, '(100d4+20)', 120, 420);
  });

  it('throws error if roll is empty after sanitizing', () => {
    expect(() => {
      roller.roll('empty');
    }).to.throw(/Can't calculate empty roll/);
  });

  it('can roll with advantage', () => {
    const result = roller.rollAdvantage('+7');

    assertResult(result, '1d20+7', 8, 27);
  });

  it('can roll with disadvantage', () => {
    const result = roller.rollDisadvantage('+7');

    assertResult(result, '1d20+7', 8, 27);
  });

  it('assumes unsigned modifier is addition', () => {
    const result = roller.rollAdvantage('7');

    assertResult(result, '1d20+7', 8, 27);
  });
});
