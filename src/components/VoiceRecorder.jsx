import React, { Component } from "react";
import { func } from "prop-types";
import classNames from "classnames";
import MicRecorder from "mic-recorder-to-mp3";

import Timer from "./Timer";
import record from "../icons/record.svg";
import reset from "../icons/reset.svg";
import stop from "../icons/stop.svg";

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

  get timer() {
    const { isRecording, recordedAudio, resetTimer } = this.state;
    const modifier = recordedAudio ? "recorder-timer--finished" : "";

    return (
      <Timer
        {...this.props}
        className={classNames("recorder-timer", modifier)}
        isRunning={isRecording}
        onTimerStop={this.stopRecording}
        resetTimer={resetTimer}
      />
    );
  }

  get icon() {
    const { isRecording, recordedAudio } = this.state;

    if (recordedAudio) {
      return (
        <img
          src={reset}
          className={classNames("icon", "recorder-static-icon")}
          alt="reset icon"
          onClick={this.resetRecorder}
        />
      );
    }

    return isRecording ? (
      <img
        src={stop}
        className={classNames("icon", "recorder-static-icon")}
        alt="stop icon"
        onClick={this.stopRecording}
      />
    ) : (
      <img
        src={record}
        className={classNames("icon", "recorder-animated-icon")}
        alt="record icon"
        onClick={this.startRecording}
      />
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
        {this.icon}
        {this.timer}
      </div>
    );
  }
}
