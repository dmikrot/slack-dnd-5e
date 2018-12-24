var Roller = require('../roller');
var roller = new Roller();
var chai = require('chai');
var expect = chai.expect;

chai.use(require('dirty-chai'));

describe('roller', function () {
  var assertResult = function (result, roll, min, max) {
    expect(result).to.have.property('roll');
    expect(result).to.have.property('total');
    expect(result.roll).to.eq(roll);
    if (max !== undefined) {
      expect(result.total).to.be.within(min, max);
    } else {
      expect(result.total).to.eq(min);
    }
  };

  it('assumes a single dice if how many to roll is missing', function () {
    var result = roller.roll('d4');

    assertResult(result, 'd4', 1, 4);
  });

  it('can add', function () {
    var result = roller.roll('1d4+4');

    assertResult(result, '1d4+4', 5, 8);
  });

  it('can multiply', function () {
    var result = roller.roll('1d4*2');

    assertResult(result, '1d4*2', 2, 8);
  });

  it('can subtract', function () {
    var result = roller.roll('1d4-1');

    assertResult(result, '1d4-1', 0, 3);
  });

  it('can divide', function () {
    var result = roller.roll('1d10/2');

    assertResult(result, '1d10/2', 0, 5);
  });

  it('can modulo', function () {
    var result = roller.roll('1d10%2');

    assertResult(result, '1d10%2', 0, 1);
  });

  it('rounds down', function () {
    var result = roller.roll('9/2');

    assertResult(result, '9/2', 4);
  });

  it('can roll many dice', function () {
    var result = roller.roll('100d4');

    assertResult(result, '100d4', 100, 400);
  });

  it('gives random results', function () {
    var firstResult = roller.roll('10d10000');
    var secondResult = roller.roll('10d10000');

    assertResult(firstResult, '10d10000', 10, 100000);
    assertResult(secondResult, '10d10000', 10, 100000);
    expect(firstResult.total).to.not.eq(secondResult.total);
  });

  it('sanitizes unexpected characters', function () {
    var result = roller.roll(';eval(10.0[d]4+&2!0)');

    assertResult(result, '(100d4+20)', 120, 420);
  });

  it('throws error if roll is empty after sanitizing', function () {
    expect(function () {
      roller.roll('empty');
    }).to.throw(/Can't calculate empty roll/);
  });

  it('can roll with advantage', function () {
    var result = roller.rollAdvantage('+7');

    assertResult(result, '1d20+7', 8, 27);
  });

  it('can roll with disadvantage', function () {
    var result = roller.rollDisadvantage('+7');

    assertResult(result, '1d20+7', 8, 27);
  });

  it('assumes unsigned modifier is addition', function () {
    var result = roller.rollAdvantage('7');

    assertResult(result, '1d20+7', 8, 27);
  });
});
