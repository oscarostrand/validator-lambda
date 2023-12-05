import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs"
import * as path from 'path';
import { Duration } from 'aws-cdk-lib';

export class ValidatorLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this,'validator-lambda',{
      functionName: 'ad-validator',
      entry: path.join(__dirname, `/../function/app.ts`),
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      memorySize: 2048,
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
        nodeModules: ["@sparticuz/chromium"],
      },
      layers: [lambda.LayerVersion.fromLayerVersionArn(this, 'chromium-lambda-layer',
        'arn:aws:lambda:eu-west-1:764866452798:layer:chrome-aws-lambda:38'
      )]

    })
  }
}
