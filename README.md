# Greenhills Server

This project contains a greenhills serverless application, demonstrating integration with CodeBuild, codeDeploy and CodePipeline.

It was used as a testbed to familiarise the steps required for these deployment concepts in AWS

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can 
update the template to add AWS resources through the same deployment process that updates your application code.

The integrated development environment (IDE) can be used to build and test the application using the AWS Toolkit, but this is a stepping stone to understanding the SAM cli deployment 
options.
The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through 
debugging experience for Lambda function code. See the following link to get started.

* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Java8 - [Install the Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To fully control the  build and deployment of the application, run the following, with the obvious changes to
directory strucutres, etc:

```bash
sam build   --template /Users/gerardsavage/dev/greenhills-server/template.yaml  --build-dir /Users/gerardsavage/dev/greenhills-server/.aws-sam/build
sam package --template-file /Users/gerardsavage/dev/greenhills-server/.aws-sam/build/template.yaml --output-template-file /Users/gerardsavage/dev/greenhills-server/.aws-sam/build/packaged-template.yaml --s3-bucket greenhills-server
sam deploy --template-file /Users/gerardsavage/dev/greenhills-server/.aws-sam/build/packaged-template.yaml --stack-name greenhills-server --capabilities CAPABILITY_IAM --region eu-west-1 --s3-bucket greenhills-server

```

The first command prepares the two lambdas in the project for deployment (java lambda under ContactDetailsFunction, nodejs lambda on the root) with updated template.yaml under
.aws-sam directory
The second command uploads the corresponding lambda zip files onto the appropriate S3 bucket
The third command creates the cloudformation stack that will define the API Gateway, Lambdas and CodeDeploy artifacts, with associated Roles, etc
**Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` 
without parameters to deploy changes to your application.

You can find the API Gateway Endpoint URL in the output values displayed after deployment.

## Using CodeBuild
After initial testing, recommend that the latest Ubuntu image is selected for the build environment. 

There is a **pre-build** command stage required to generate a functioning gradle wrapper for the ContactDetailsFunction. Without this, the gradlew command failed to run. The **build** 
command executes the `sam build` command, populating the lambda artifacts under the .aws_sam directory. The **post-build** stage executes the `sam package` command, uploading the 
lambda artifacts onto the S3 bucket. Finally, the `packaged-template.yaml` artifact is uploaded to the S3 bucket

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
AWS$ sam build
```

The SAM CLI installs dependencies defined in `HelloWorldFunction/build.gradle`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
AWS$ sam local invoke HelloWorldFunction --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
AWS$ sam local start-api
AWS$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
AWS$ sam logs -n HelloWorldFunction --stack-name AWS --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `HelloWorldFunction/src/test` folder in this project.

```bash
AWS$ cd HelloWorldFunction
HelloWorldFunction$ gradle test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name AWS
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
