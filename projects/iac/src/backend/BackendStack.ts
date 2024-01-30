import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackendVpcStack } from './BackendVpcStack';
import { ClusterStack } from './ClusterStack';
import { ServiceStack } from './ServiceStack';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpcStack = new BackendVpcStack(this, 'Vpc', props);

    const cluster = new ClusterStack(this, 'Cluster', { ...props, vpc: vpcStack.vpc });

    cluster.addDependency(vpcStack);

    const serviceStack = new ServiceStack(this, 'Service', { ...props, cluster: cluster.cluster });

    serviceStack.addDependency(cluster);
  }
}
