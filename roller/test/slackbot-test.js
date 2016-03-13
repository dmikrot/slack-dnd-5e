var slackBot = require('../slackbot/handler').slackBot;
var chai = require('chai');
var expect = chai.expect;

chai.use(require('dirty-chai'));

describe('root command', function () {
  var received;
  var receivedArgs;
  var callback = function (error, success) {
    received = true;
    receivedArgs = [error, success];
  };

  beforeEach(function () {
    received = false;
    receivedArgs = [];
  });

  it('responds with result', function () {
    slackBot.root({
      args: {
        rolls: ['2d4+1']
      },
      userName: 'testUser'
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('in_channel');
    expect(receivedArgs[1].text).to.match(/testUser rolls 2d4\+1 and gets [3-9]/);
  });

  it('responds with multiple results', function () {
    var lines;
    var i;
    slackBot.root({
      args: {
        rolls: ['2d4+1', '2d4+1']
      },
      userName: 'testUser'
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('in_channel');
    lines = receivedArgs[1].text.split('\n');
    expect(lines.length).to.eq(2);
    for (i = 0; i < lines.length; ++i) {
      expect(lines[i]).to.match(/testUser rolls 2d4\+1 and gets [3-9]/);
    }
  });

  it('responds with help for no rolls', function () {
    var helpArgs;
    slackBot.help({}, function (error, result) {
      helpArgs = [error, result];
    });

    slackBot.root({
      args: {
        rolls: []
      },
      userName: 'testUser'
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs).to.deep.eq(helpArgs);
  });

  it('responds with error message for invalid rolls', function () {
    var error = 'You asked me to roll "2d8", "+", "1".\nI couldn\'t figure out how to roll "+".';

    slackBot.root({
      args: {
        rolls: ['2d8', '+', '1']
      },
      userName: 'testUser'
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('ephemeral');
    expect(receivedArgs[1].text).to.eq(error);
  });
});
