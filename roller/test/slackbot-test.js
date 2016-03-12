var slackBot = require('../slackbot/handler').slackBot;
var chai = require('chai');
var expect = chai.expect;

chai.use(require('dirty-chai'));

describe('slackbot', function () {
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

  it('responds to root command', function () {
    slackBot.root({
      args: {
        rolls: ['2d4+1']
      },
      userName: 'testUser'
    }, callback);
    expect(received).to.be.true();
    expect(receivedArgs).to.deep.eq([null, slackBot.inChannelResponse('testUser rolls 2d4+1 and gets 5')]);
  });
});
