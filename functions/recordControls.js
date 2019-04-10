exports.handler = function(context, event, callback) {
  let client = context.getTwilioClient(),
    setStatus = event.setStatus,
    callSid = event.callSid,
    recordingSid = event.recordingSid,
    responseBody = {
      recordingSid: null,
      status: null,
      error: null
    };

  // set CORS to allow request
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  switch (setStatus) {
    // create a call recording
    case "create":
      client
        .calls(callSid)
        .recordings.create()
        .then(recording => {
          responseBody.recordingSid = recording.sid;
          responseBody.status = recording.status;
          response.setBody(responseBody);

          callback(null, response);
        })
        .catch(err => {
          // return error message to Flex
          responseBody.error = err;
          response.setBody(responseBody);

          callback(null, response);
        });

      break;

    // update existing call recording
    case "in-progress":
    case "paused":
    case "stopped":
      client
        .calls(callSid)
        .recordings(recordingSid)
        .update({ status: setStatus })
        .then(recording => {
          responseBody.recordingSid = recording.sid;
          responseBody.status = recording.status;
          response.setBody(responseBody);

          callback(null, response);
        })
        .catch(err => {
          // return error message to Flex
          responseBody.error = err;
          response.setBody(responseBody);

          callback(null, response);
        });

      break;

    default:
      throw "unexpected status";
  }
};
