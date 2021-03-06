var aws = require('aws-sdk'); 
var request = require('request');
require('dotenv').config(); // Configure dotenv to load in the .env file


// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
    region: 'us-east-1', // Put your aws region here
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    signature: 'v4'
})


exports.search_photo = (req,res) => {

  // Set up the payload of what we are sending to the S3 api
    // const s3Params = {
    //   Bucket: 'photo-cc-p2-bucket', //S3_BUCKET,
    //   Key: fileName,
    //   Expires: 50,
    //   ContentType: fileType,
    //   ACL: 'public-read',
    //   Metadata: {'customlabels': Metadata}
    // };
    console.log("req.query: ", req.query);
    console.log("req.query.query: ", req.query.query);
    console.log("serach photo triggered!");

    request({
        url:'https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search',
        qs: { search:req.query.query }, function(err, response, body) {
            if (err) { console.log("ERROR: ", err); return; }
            console.log("Get response: " + response);
            console.log("Get response statuscode: " + response.statusCode);
        }
    })

    console.log("response: ");

    // s3.getSignedUrl('putObject', s3Params, (err, data) => {
    //   if(err){
    //     console.log(err);
    //     res.json({success: false, error: err})
    //   }
    //   // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
    //   const returnData = {
    //     signedRequest: data,
    //     url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    //   };
    //   res.json({success:true, data:{returnData}});
    // });
}