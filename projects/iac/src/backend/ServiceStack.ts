import { Duration, RemovalPolicy, Stack, StackProps, aws_ecs, aws_ecs_patterns, aws_logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type ServiceStackProps = {
  cluster: aws_ecs.Cluster;
} & StackProps;

export class ServiceStack extends Stack {
  cluster: aws_ecs.Cluster;
  applicationLoadBalancedFargateService: aws_ecs_patterns.ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);
    this.cluster = props.cluster;

    this.applicationLoadBalancedFargateService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'ALB01',
      {
        serviceName: 'Service01',
        cluster: this.cluster,
        taskImageOptions: {
          image: aws_ecs.ContainerImage.fromAsset('./../backend/app-code/dist'),
          containerPort: 80,
          logDriver: new aws_ecs.AwsLogDriver({
            logGroup: new aws_logs.LogGroup(this, 'ALB01LogGroup', {
              logGroupName: 'Service01',
              removalPolicy: RemovalPolicy.DESTROY,
            }),
            streamPrefix: 'Service01',
          }),
        },
        desiredCount: 1,
        memoryLimitMiB: 1024,
        cpu: 256,
        listenerPort: 80,
        publicLoadBalancer: true,
      },
    );

    this.applicationLoadBalancedFargateService.targetGroup.configureHealthCheck({
      path: '/health',
      port: '80',
      interval: Duration.seconds(60),
      timeout: Duration.seconds(5),
    });

    const scalabletaskCount = this.applicationLoadBalancedFargateService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 1,
    });

    scalabletaskCount.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60),
    });
  }
}
