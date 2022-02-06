#slack-dnd-5e

## Development

This project uses a `lambda-slack-router` node module fork found here: <https://gitlab.com/DonovanMN/lambda-slack-router>. For documentation on how to add subcommands to the router, see the README.

## Configuration

Install the necessary node modules:

    $ npm install

Install serverless:

    $ npm install -g serverless

## Deployment

First, set the slack token env variable:

    $ export SLACK_VERIFICATION_TOKEN=<token>

Then, deploy the function and endpoint from scratch:

    $ serverless deploy

Take the endpoints url, enter it into the slack integration configuration, and save.

To quickly deploy updated function code only during development, run:

    $ serverless deploy function --function slackbot

## Run Test Suite

    $ npm test

## Run Linter

    $ npm run lint
