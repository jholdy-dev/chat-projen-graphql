import { App } from 'aws-cdk-lib';
import { BackendStack } from './backend';

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new BackendStack(app, 'BackendHoYeahStack', { env: devEnv });

app.synth();
