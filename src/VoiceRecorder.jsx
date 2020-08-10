import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import MicRecorder from "mic-recorder-to-mp3";
import moment from "moment";

import Timer from "./Timer";
import ProgressBar from "./ProgressBar";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class VoiceRecorder extends Component {
  static propTypes = {
    maxRecordingTime: PropTypes.string.isRequired,
    onRecordStart: PropTypes.func,
    onRecordStop: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.baseClass = "bve-voice-recorder";

    this.initialPlayerState = {
      isPlaying: false,
      currentTime: "00:00",
      rawCurrentTime: 0,
    };

    this.reportElapsedTime = this.reportElapsedTime.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);

    this.state = {
      isBlocked: false,
      isRecording: false,
      rawDuration: 0,
      recordedAudio: "",
      recordingDuration: "00:00",
      recordingElapsed: "0",
      ...this.initialPlayerState,
    };
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      this.setIsBlocked(true),
      this.setIsBlocked(false)
    );
  }

  setIsBlocked(isBlocked) {
    this.setState(() => ({ isBlocked }));
  }

  startRecording() {
    const { onRecordStart } = this.props;
    const { isBlocked } = this.state;

    if (isBlocked) {
      // to be addressed in future story
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState(() => ({ isRecording: true }));
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

  reportElapsedTime(recordingElapsed) {
    this.setState(() => ({ recordingElapsed }));
  }

  get recorder() {
    const { maxRecordingTime } = this.props;
    const { isRecording, recordingElapsed } = this.state;

    const initialTimeInSeconds = moment
      .duration(`00:${maxRecordingTime}`)
      .asSeconds();

    return (
      <Fragment>
        <ProgressBar
          currentProgress={recordingElapsed}
          maxProgress={initialTimeInSeconds}
        />
        <Timer
          {...this.props}
          isRunning={isRecording}
          maxTime={maxRecordingTime}
          onTimerStop={this.stopRecording}
          reportElapsedTime={this.reportElapsedTime}
        />
      </Fragment>
    );
  }

  get recordingIcon() {
    const { isRecording } = this.state;

    return isRecording ? (
      <button
        description="stop icon"
        fill="error"
        name="stop"
        onClick={this.stopRecording}
      />
    ) : (
      <button
        description="record icon"
        fill="inactive"
        name="record"
        onClick={this.startRecording}
      />
    );
  }

  render() {
    return (
      <div className={this.baseClass}>
        {this.recordingIcon}
        {this.recorder}
      </div>
    );
  }
}
