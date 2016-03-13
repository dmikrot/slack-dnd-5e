'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support
 */

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Slackbot router
var SlackBot = require('lambda-slack-router');

// Slack subcommands
var slackBot = new SlackBot({ token: process.env.SLACK_VERIFICATION_TOKEN });

// Require dice roller
var Roller = require('./roller.js');
var roller = new Roller();

slackBot.setRootCommand('rolls...', '1d20+7 (2d6+3)/2', function (options, callback) {
  var results;
  var response;
  var invalidRolls;
  if (options.args.rolls.length) {
    try {
      results = roller.rollAll(options.args.rolls);
      response = results.map(function (result) {
        return options.userName + ' rolls ' + result.roll + ' and gets ' + result.total;
      });
      callback(null, this.inChannelResponse(response.join('\n')));
    } catch (e) {
      invalidRolls = roller.findInvalidRolls(options.args.rolls);
      response = invalidRolls.map(function (invalid) {
        return 'I couldn\'t figure out how to roll "' + invalid + '".';
      });
      response.unshift('You asked me to roll "' + options.args.rolls.join('", "') + '".');
      callback(null, this.ephemeralResponse(response.join('\n')));
    }
  } else {
    slackBot.help(options, callback);
  }
});

// Router configuration
module.exports.handler = slackBot.buildRouter();
module.exports.slackBot = slackBot;
