import { Stack, StackProps, aws_ec2, aws_ecs } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type ClusterStackProps = {
  vpc: aws_ec2.Vpc;
} & StackProps;

export class ClusterStack extends Stack {
  cluster: aws_ecs.Cluster;
  vpc: aws_ec2.Vpc;
  constructor(scope: Construct, id: string, props: ClusterStackProps) {
    super(scope, id, props);
    this.vpc = props.vpc;

    this.cluster = new aws_ecs.Cluster(this, 'BackendHoYeahCluster', {
      clusterName: 'BackendHoYeahCluster',
      vpc: this.vpc,
    });
  }
}
