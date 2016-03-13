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

slackBot.setRootCommand('rolls...', 'Roll dice and get the result', function (options, callback) {
  if (options.args.rolls.length) {
    var results = roller.rollAll(options.args.rolls);
    var response = results.map(function (result) {
      return options.userName + ' rolls ' + result.roll + ' and gets ' + result.result;
    });
    callback(null, this.inChannelResponse(response.join('\n')));
  } else {
    slackBot.help(options, callback);
  }
});

// Router configuration
module.exports.handler = slackBot.buildRouter();
module.exports.slackBot = slackBot;
