'use strict';

const AWS = require('aws-sdk');
const codedeploy = new AWS.CodeDeploy({apiVersion: '2014-10-06'});
var lambda = new AWS.Lambda();

exports.handler = (event, context, callback) => {

    console.log("Entering PreTraffic Hook!");

    // Read the DeploymentId & LifecycleEventHookExecutionId from the event payload
    var deploymentId = event.DeploymentId;
    var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

    var functionToTest = process.env.NewVersion;
    console.log("Testing new function version: " + functionToTest);

    // Perform validation of the newly deployed Lambda version
    var lambdaParams = {
        FunctionName: functionToTest,
        InvocationType: "RequestResponse"
    };

    var lambdaResult = "Failed";
    lambda.invoke(lambdaParams, function(err, data) {
        if (err){	// an error occurred
            console.log(err, err.stack);
            lambdaResult = "Failed";
        }
        else{	// successful response
            var result = JSON.parse(data.Payload);
            console.log("Result: " +  JSON.stringify(result));

            // Check the response for valid results
            // The response will be a JSON payload with statusCode and body properties. eg:
            // {
            //     "body": "{\"phoneNumber\":\"074 1500 1600\",\"emailAddress\":\"contact@greenhillsconsultancy.co.uk\"}",
            //     "headers": {},
            //     "statusCode": 200
            // }
            if(result.statusCode == 200){
                console.log ("Validation testing: correct status code returned");
                var bodyResult = JSON.parse(result.body);
                console.log("Body is: " +  JSON.stringify(bodyResult));
                if (bodyResult.emailAddress != "contact@greenhillsconsultancy.co.uk") {
                    lambdaResult = "Failed";
                    console.log ("Validation testing for email contact address failed!");
                } else {
                    lambdaResult = "Succeeded";
                    console.log ("Validation testing success!!");
                }
            }
            else{
                lambdaResult = "Failed";
                console.log ("Validation testing failed, bad status code!");
            }

            // Complete the PreTraffic Hook by sending CodeDeploy the validation status
            var params = {
                deploymentId: deploymentId,
                lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
                status: lambdaResult // status can be 'Succeeded' or 'Failed'
            };

            // Pass AWS CodeDeploy the prepared validation test results.
            codedeploy.putLifecycleEventHookExecutionStatus(params, function(err, data) {
                if (err) {
                    // Validation failed.
                    console.log('CodeDeploy Status update failed');
                    console.log(err, err.stack);
                    callback("CodeDeploy Status update failed");
                } else {
                    // Validation succeeded.
                    console.log('Codedeploy status updated successfully');
                    callback(null, 'Codedeploy status updated successfully');
                }
            });
        }
    });
}