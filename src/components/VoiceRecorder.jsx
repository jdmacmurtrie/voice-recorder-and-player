import React, { Component } from "react";
import { func } from "prop-types";
import classNames from "classnames";
import MicRecorder from "mic-recorder-to-mp3";

import Timer from "./Timer";
import recordIcon from "../icons/record.svg";
import resetIcon from "../icons/reset.svg";
import stopIcon from "../icons/stop.svg";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class VoiceRecorder extends Component {
  static propTypes = {
    onRecordStop: func,
  };

  constructor(props) {
    super(props);

    // declared separately for easy reset
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

    this.state = this.initialPlayerState;
  }

  componentDidMount() {
    // requests access to use browser microphone
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      this.setIsBlocked(true),
      this.setIsBlocked(false)
    );
  }

  get timer() {
    const { onRecordStop } = this.props;
    const { isRecording, recordedAudio, resetTimer } = this.state;
    const modifier = recordedAudio ? "recorder-timer--finished" : "";

    return (
      <Timer
        className={classNames("recorder-timer", modifier)}
        isRunning={isRecording}
        onRecordStop={onRecordStop}
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
          src={resetIcon}
          className={classNames("icon", "recorder-static-icon")}
          alt="reset icon"
          onClick={this.resetRecorder}
        />
      );
    }

    return isRecording ? (
      <img
        src={stopIcon}
        className={classNames("icon", "recorder-static-icon")}
        alt="stop icon"
        onClick={this.stopRecording}
      />
    ) : (
      <img
        src={recordIcon}
        className={classNames("icon", "recorder-animated-icon")}
        alt="record icon"
        onClick={this.startRecording}
      />
    );
  }

  setIsBlocked = (isBlocked) => {
    this.setState({ isBlocked });
  };

  startRecording = () => {
    Mp3Recorder.start()
      .then(() => {
        this.setState({ isRecording: true, resetTimer: false });
      })
      .catch((e) => console.error(e));
  };

  stopRecording = () => {
    const { onRecordStop } = this.props;
    const { isRecording } = this.state;

    if (!isRecording) {
      return;
    }

    // The mic-recorder-to-mp3 does all the heavy lifting here to grab the recorded audio
    Mp3Recorder.stop()
      .getMp3()
      .then(([, blob]) => {
        const recordedAudio = URL.createObjectURL(blob);

        onRecordStop(recordedAudio);
        this.setState({ recordedAudio, isRecording: false });
      })
      .catch((e) => console.warn(e));

    this.setState({ isRecording: false });
  };

  resetRecorder = () => {
    this.setState(this.initialPlayerState);
  };

  render() {
    const { isBlocked } = this.state;

    return isBlocked ? (
      <div>Please must give browser permission to make a recording</div>
    ) : (
      <div>
        {this.icon}
        {this.timer}
      </div>
    );
  }
}
