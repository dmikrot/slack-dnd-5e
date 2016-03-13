#slack-dnd-5e

## Development

This project uses the `lambda-slack-router` node module found here: <https://github.com/localytics/lambda-slack-router>. For documentation on how to add subcommands to the router, see the README.

## Configuration

Install the necessary node modules by running `npm install` in both the root directory and `roller` directory:

    $ npm install
    $ cd roller
    $ npm install

## Deployment

First, set the env variable in AWS using Serverless:

    $ sls env set -s <stage> -k SLACK_VERIFICATION_TOKEN -v <token>

Then, deploy the resources:

    $ sls resources deploy -s <stage>

Next, deploy the function and endpoint:

    $ cd roller
    $ sls dash deploy -s <stage>

Take the postback url, enter it into the slack integration configuration, and save.

Deploy a new version of the function to the same stage:

    $ cd roller
    $ sls function deploy -s <stage>

## Testing

`cd` into the correct directory and run `npm test`:

    $ cd roller
    $ npm test

## Linting

`cd` into the correct directory and run `npm run lint`:

    $ cd roller
    $ npm run lint
