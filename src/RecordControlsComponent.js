import React from "react";
import { connect } from "react-redux";

const request = require("request");

export class RecordControlsComponent extends React.Component {
  constructor(props) {
    super(props);

    // local state of recording
    this.state = {
      recordingStatus: "Not Started",
      recordingSid: null,
      recordingMessage: null
    };
  }

  makeRequest = t => {
    // show progress
    this.setState({ recordingMessage: `Making ${t} request...` });

    // create Function payload
    let requestURL = `${this.props.serviceBaseUrl}/recordControls?`;
    requestURL += `setStatus=${t}`;
    requestURL += `&recordingSid=${this.state.recordingSid}`;
    requestURL += `&callSid=${
      this.props.task.attributes.conference.participants.customer
    }`;

    // make request to Function
    request.post(requestURL, (err, response, body) => {
      if (err) {
        this.setState({ recordingMessage: `Unable to make request.` });
      }

      // parse JSON response
      let thisResult = JSON.parse(body);

      // update state with response
      if (thisResult.error) {
        this.setState({ recordingMessage: thisResult.error.message });
      } else {
        this.setState({
          recordingMessage: null,
          recordingSid: thisResult.recordingSid,
          recordingStatus: thisResult.status
        });
      }
    });
  };

  // returns button when filter condition met and call is active
  simpleButton = (value, action, showWhen) => {
    if (
      !showWhen.includes(this.state.recordingStatus) ||
      !this.props.phoneCallActive
    ) {
      return null;
    } else {
      return (
        <span id={"recordControlButton-" + action}>
          <input
            type="button"
            value={value}
            onClick={m => this.makeRequest(action)}
          />
        </span>
      );
    }
  };

  render() {
    // reset the controls/message when task moves to wrapping
    if (
      this.props.task.status === "wrapping" &&
      this.state.recordingStatus !== "No Active Call"
    ) {
      this.setState({
        recordingMessage: null,
        recordingStatus: "No Active Call"
      });
    }

    return (
      <div id="recordControls" key="recordControls">
        <div id="recordControlsStatus">
          Status: {this.state.recordingStatus}
          {this.state.recordingSid ? `(${this.state.recordingSid})` : ""}
        </div>

        {/* create button for each action */}
        <div id="recordControlsButtons">
          {this.simpleButton("Start", "create", ["stopped", "Not Started"])}
          {this.simpleButton("Resume", "in-progress", ["paused"])}
          {this.simpleButton("Pause", "paused", ["in-progress"])}
          {this.simpleButton("Stop", "stopped", ["in-progress"])}
        </div>

        {/* display update / error messages */}
        <div id="recordControlsMessage">{this.state.recordingMessage}</div>
        <hr />
      </div>
    );
  }
}

// pass in agent phone status and runtime domain (Functions)
const mapStateToProps = state => {
  return {
    serviceBaseUrl: `https://${state.flex.config.serviceBaseUrl}`,
    phoneCallActive: state.flex.phone.connection ? true : false
  };
};

export default connect(mapStateToProps)(RecordControlsComponent);
