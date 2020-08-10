import React, { Component, Fragment } from "react";
import { func } from "prop-types";
import MicRecorder from "mic-recorder-to-mp3";

import Timer from "./Timer";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class VoiceRecorder extends Component {
  static propTypes = {
    onRecordStart: func,
    onRecordStop: func,
  };

  constructor(props) {
    super(props);

    this.initialPlayerState = {
      isBlocked: false,
      isRecording: false,
      rawDuration: 0,
      recordedAudio: "",
      recordingDuration: "00:00",
      recordingElapsed: "0",
      resetTimer: true,
      isPlaying: false,
      currentTime: "00:00",
      rawCurrentTime: 0,
    };

    this.resetRecorder = this.resetRecorder.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);

    this.state = this.initialPlayerState;
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      this.setIsBlocked(true),
      this.setIsBlocked(false)
    );
  }

  get recorder() {
    const { isRecording, resetTimer } = this.state;

    return (
      <Timer
        {...this.props}
        isRunning={isRecording}
        onTimerStop={this.stopRecording}
        resetTimer={resetTimer}
      />
    );
  }

  get buttons() {
    const { isRecording, recordedAudio } = this.state;

    return (
      <Fragment>
        {isRecording ? (
          <button onClick={this.stopRecording}>Stop</button>
        ) : (
          <button onClick={this.startRecording}>Record</button>
        )}
        {recordedAudio && <button onClick={this.resetRecorder}>Reset</button>}
      </Fragment>
    );
  }

  setIsBlocked(isBlocked) {
    this.setState(() => ({ isBlocked }));
  }

  startRecording() {
    const { onRecordStart } = this.props;
    const { isBlocked } = this.state;

    if (isBlocked) {
      // TODO
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState(() => ({ isRecording: true, resetTimer: false }));
        })
        .catch((e) => console.error(e));
    }

    if (onRecordStart) {
      onRecordStart();
    }
  }

  stopRecording() {
    const { onRecordStop } = this.props;
    const { isRecording } = this.state;

    if (!isRecording) {
      return;
    }

    Mp3Recorder.stop()
      .getMp3()
      .then(([, blob]) => {
        const recordedAudio = URL.createObjectURL(blob);

        this.setState(() => ({ recordedAudio, isRecording: false }));
        if (onRecordStop) {
          onRecordStop(recordedAudio);
        }
      })
      .catch((e) => console.warn(e));

    this.setState(() => ({ isRecording: false }));
  }

  resetRecorder() {
    this.setState(this.initialPlayerState);
  }

  render() {
    return (
      <div>
        {this.recorder}
        {this.buttons}
      </div>
    );
  }
}
