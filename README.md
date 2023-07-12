# Event-Driven Architecture with AWS CDK v2

This repository contains code examples for creating an event-driven architecture using AWS CDK v2, Amazon EventBridge, and API Gateway.

🔗 [The Medium article](https://medium.com/@dobeerman/event-driven-architecture-via-httpapi-a-practical-guide-b745ba7f5e59)

## Overview

The code in this repository demonstrates how to:

- Create an Amazon EventBridge EventBus.
- Set up an Amazon API Gateway HTTP API.
- Define an IAM role and grant it permissions to put events to the EventBus.
- Create an API Gateway integration to send events to the EventBus.
- Set up routes for the HTTP API.
- Log all events to a CloudWatch Logs log group.

## Prerequisites

- AWS account
- Node.js and npm installed
- AWS CDK installed

## Setup

1. Clone this repository.
2. Navigate to the repository directory.
3. Install the necessary npm packages: `npm install`
5. Deploy the CDK stack: `cdk deploy`

## Cleanup

To delete the resources created by this stack, you can destroy the stack with: `cdk destroy`

## More Information

For a detailed walkthrough of the code and the concepts behind it, check out the accompanying [Medium article](LINK_TO_YOUR_MEDIUM_ARTICLE).



## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
