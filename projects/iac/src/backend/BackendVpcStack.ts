import { Stack, StackProps, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BackendVpcStack extends Stack {
  vpc: aws_ec2.Vpc;
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    this.vpc = new aws_ec2.Vpc(this, 'BackendVpcStack-hoyeahapp', {
      maxAzs: 3,
    });
  }
}
