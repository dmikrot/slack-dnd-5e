/* global describe beforeEach it */
const chai = require('chai');
const { slackBot } = require('../handler');

const { expect } = chai;

chai.use(require('dirty-chai'));

describe('root command', () => {
  let received;
  let receivedArgs;
  const callback = (error, success) => {
    received = true;
    receivedArgs = [error, success];
  };

  beforeEach(() => {
    received = false;
    receivedArgs = [];
  });

  it('responds with result', () => {
    slackBot.root({
      args: {
        rolls: ['2d4+1'],
      },
      body: {
        user_name: 'testUser',
      },
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('in_channel');
    expect(receivedArgs[1].text).to.match(/testUser rolls 2d4\+1 and gets [3-9]/);
  });

  it('responds with multiple results', () => {
    let i;
    slackBot.root({
      args: {
        rolls: ['2d4+1', '2d4+1'],
      },
      body: {
        user_name: 'testUser',
      },
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('in_channel');
    const lines = receivedArgs[1].text.split('\n');
    expect(lines.length).to.eq(2);
    for (i = 0; i < lines.length; i += 1) {
      expect(lines[i]).to.match(/testUser rolls 2d4\+1 and gets [3-9]/);
    }
  });

  it('responds with help for no rolls', () => {
    let helpArgs;
    slackBot.help({}, (error, result) => {
      helpArgs = [error, result];
    });

    slackBot.root({
      args: {
        rolls: [],
      },
      body: {
        user_name: 'testUser',
      },
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs).to.deep.eq(helpArgs);
  });

  it('responds with error message for invalid rolls', () => {
    const errors = [{ text: 'I couldn\'t figure out how to roll "+".' }];
    slackBot.root({
      args: {
        rolls: ['2d8', '+', '1'],
      },
      body: {
        user_name: 'testUser',
      },
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('ephemeral');
    expect(receivedArgs[1].text).to.eq('You asked me to roll "2d8", "+", "1":');
    expect(receivedArgs[1].attachments).to.deep.eq(errors);
  });
});

describe('adv command', () => {
  let received;
  let receivedArgs;
  const callback = (error, success) => {
    received = true;
    receivedArgs = [error, success];
  };

  beforeEach(() => {
    received = false;
    receivedArgs = [];
  });

  it('responds with result', () => {
    const textRegex = /testUser rolls 1d20\+2 with advantage and gets [12]?[0-9]/;
    slackBot.adv({
      args: {
        modifier: '+2',
      },
      body: {
        user_name: 'testUser',
      },
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('in_channel');
    expect(receivedArgs[1].text).to.match(textRegex);
  });
});

describe('dis command', () => {
  let received;
  let receivedArgs;
  const callback = (error, success) => {
    received = true;
    receivedArgs = [error, success];
  };

  beforeEach(() => {
    received = false;
    receivedArgs = [];
  });

  it('responds with result', () => {
    const textRegex = /testUser rolls 1d20\+2 with disadvantage and gets [12]?[0-9]/;
    slackBot.dis({
      args: {
        modifier: '+2',
      },
      body: {
        user_name: 'testUser',
      },
    }, callback);

    expect(received).to.be.true();
    expect(receivedArgs[0]).to.eq(null);
    expect(receivedArgs[1].response_type).to.eq('in_channel');
    expect(receivedArgs[1].text).to.match(textRegex);
  });
});
