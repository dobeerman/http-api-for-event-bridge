import { HttpApi, HttpConnectionType, HttpIntegrationSubtype, HttpIntegrationType, PayloadFormatVersion } from "@aws-cdk/aws-apigatewayv2-alpha";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class HttpApiForEventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the EventBus
    const demoBus = new cdk.aws_events.EventBus(this, "DemoBus");

    // Define the HTTP API
    const httpApi = new HttpApi(this, "HttpApi");

    // Define the IAM role
    const role = new cdk.aws_iam.Role(this, "Role", {
      assumedBy: new cdk.aws_iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    // Grant the necessary permissions to the role
    demoBus.grantPutEventsTo(role);

    // Define the API Gateway integration
    const eventbridgeIntegration = new cdk.aws_apigatewayv2.CfnIntegration(
      this,
      "EventBridgeIntegration",
      {
        apiId: httpApi.httpApiId,
        integrationType: HttpIntegrationType.AWS_PROXY,
        integrationSubtype: HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS,
        connectionType: HttpConnectionType.INTERNET,
        credentialsArn: role.roleArn,
        requestParameters: {
          Source: "com.mycompany.$request.path.source",
          DetailType: "$request.path.detailType",
          Detail: "$request.body",
          EventBusName: demoBus.eventBusArn,
        },
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0.version,
        timeoutInMillis: 3000,
      }
    );

    // Define the API Gateway route
    new cdk.aws_apigatewayv2.CfnRoute(this, "EventRoute", {
      apiId: httpApi.httpApiId,
      routeKey: "POST /{source}/{detailType}",
      target: `integrations/${eventbridgeIntegration.ref}`,
    });

    // Define the CloudWatch Logs log group
    const logGroup = new cdk.aws_logs.LogGroup(this, 'EventLogGroup', {
      logGroupName: `/aws/events/${demoBus.eventBusName}`,
    });

    // Define the EventBus rule to collect all events
    const rule = new cdk.aws_events.Rule(this, "Logging", {
      eventBus: demoBus,
      description: "Logging all events",
      eventPattern: { region: [cdk.Stack.of(this).region], }
    });

    rule.addTarget(new cdk.aws_events_targets.CloudWatchLogGroup(logGroup));

    new cdk.CfnOutput(this, "httpApiUrl", {
      description: "HTTP API endpoint URL",
      value: httpApi.url!,
    });
  }
}
