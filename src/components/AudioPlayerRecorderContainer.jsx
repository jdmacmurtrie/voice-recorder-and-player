import React, { Component } from "react";

import AudioPlayer from "./AudioPlayer";
import VoiceRecorder from "./VoiceRecorder";

export default class AudioPlayerRecorderContainer extends Component {
  constructor(props) {
    super(props);

    this.stopRecording = this.stopRecording.bind(this);
    this.resetRecording = this.resetRecording.bind(this);

    this.state = {
      audio: "",
    };
  }

  get recorder() {
    return (
      <div className="recorder-container">
        <VoiceRecorder
          onRecordStop={this.stopRecording}
          maxRecordingTime="00:10"
        />
      </div>
    );
  }

  get player() {
    const { audio } = this.state;
    return (
      <div className="player-container">
        {audio ? <AudioPlayer audio={audio} /> : <div>No recordings yet!</div>}
      </div>
    );
  }

  stopRecording(recordedAudio) {
    this.setState(() => ({ audio: recordedAudio }));
  }

  resetRecording() {
    this.setState(() => ({ audio: "" }));
  }

  render() {
    return (
      <div className="main-container">
        {this.recorder}
        {this.player}
      </div>
    );
  }
}
