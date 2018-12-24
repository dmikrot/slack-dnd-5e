#slack-dnd-5e

## Development

This project uses the `lambda-slack-router` node module found here: <https://github.com/localytics/lambda-slack-router>. For documentation on how to add subcommands to the router, see the README.

## Configuration

Install the necessary node modules:

    $ npm install

Install serverless:

    $ npm install -g serverless

## Deployment

First, set the slack token env variable:

    $ export SLACK_VERIFICATION_TOKEN=<token>

Then, deploy the resources:

    $ serverless deploy

Take the endpoints url, enter it into the slack integration configuration, and save.

## Testing

Run `npm run test`:

    $ npm run test

## Linting

Run `npm run lint`:

    $ npm run lint
