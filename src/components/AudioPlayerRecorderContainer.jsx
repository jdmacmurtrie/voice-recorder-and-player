import React, { Component } from "react";

import AudioPlayer from "./AudioPlayer";
import VoiceRecorder from "./VoiceRecorder";

export default class AudioPlayerRecorderContainer extends Component {
  constructor(props) {
    super(props);

    this.stopRecording = this.stopRecording.bind(this);

    this.state = {
      audio: "",
    };
  }

  get recorder() {
    return (
      <div className="recorder-container">
        <VoiceRecorder onRecordStop={this.stopRecording} />
      </div>
    );
  }

  get player() {
    const { audio } = this.state;
    return (
      <div className="player-container">
        {audio ? (
          <AudioPlayer audioSrc={audio} />
        ) : (
          <div>Nothing recorded yet!</div>
        )}
      </div>
    );
  }

  stopRecording(recordedAudio) {
    this.setState({ audio: recordedAudio });
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
