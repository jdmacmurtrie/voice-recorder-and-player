import React, { Component, Fragment } from "react";

import AudioPlayer from "./AudioPlayer";
import VoiceRecorder from "./VoiceRecorder";

export default class AudioPlayerRecorder extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.resetRecording = this.resetRecording.bind(this);

    this.state = {
      audio: "",
    };
  }

  stopRecording(recordedAudio) {
    this.setState(() => ({ audio: recordedAudio }));
  }

  resetRecording() {
    this.setState(() => ({ audio: "" }));
  }

  render() {
    const { audio } = this.state;

    return (
      <div>
        {audio ? (
          <Fragment>
            <AudioPlayer audio={audio} />
            <button onClick={this.resetRecording}>Re-Record</button>
          </Fragment>
        ) : (
          <VoiceRecorder
            onRecordStop={this.stopRecording}
            maxRecordingTime="00:10"
          />
        )}
      </div>
    );
  }
}
