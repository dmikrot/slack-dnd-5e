'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support
 */

// Require Slackbot router
var SlackBot = require('lambda-slack-router');

// Slack subcommands
var slackBot = new SlackBot({ token: process.env.SLACK_VERIFICATION_TOKEN });

// Require dice roller
var Roller = require('./roller.js');
var roller = new Roller();

var handleErrors = function (rolls, callback) {
  callback(null, slackBot.ephemeralResponse({
    text: 'You asked me to roll "' + rolls.join('", "') + '":',
    attachments: [{
      text: roller.findInvalidRolls(rolls).map(function (invalid) {
        return 'I couldn\'t figure out how to roll "' + invalid + '".';
      }).join('\n')
    }]
  }));
};

slackBot.setRootCommand(['rolls...'], '1d20+7 (2d6+3)/2', function (options, callback) {
  var results;
  var response;

  if (options.args.rolls.length) {
    try {
      results = roller.rollAll(options.args.rolls);
      response = results.map(function (result) {
        return options.body.user_name + ' rolls ' + result.roll + ' and gets ' + result.total;
      });
      callback(null, this.inChannelResponse(response.join('\n')));
    } catch (e) {
      handleErrors(options.args.rolls, callback);
    }
  } else {
    slackBot.help(options, callback);
  }
});

slackBot.addCommand('adv', ['modifier'], 'Roll 1d20 with advantage', function (options, callback) {
  var result;
  try {
    result = roller.rollAdvantage(options.args.modifier);
    callback(null, this.inChannelResponse(options.body.user_name + ' rolls ' + result.roll
      + ' with advantage and gets ' + result.total));
  } catch (e) {
    handleErrors(['1d20' + options.args.modifier], callback);
  }
});

slackBot.addCommand('dis', ['modifier'], 'Roll 1d20 with disadvantage', function (options, callback) {
  var result;
  try {
    result = roller.rollDisadvantage(options.args.modifier);
    callback(null, this.inChannelResponse(options.body.user_name + ' rolls ' + result.roll
      + ' with disadvantage and gets ' + result.total));
  } catch (e) {
    handleErrors(['1d20' + options.args.modifier], callback);
  }
});

// Router configuration
module.exports.router = slackBot.buildRouter();
module.exports.slackBot = slackBot;
