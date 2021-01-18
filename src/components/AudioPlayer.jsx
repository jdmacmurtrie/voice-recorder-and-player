import React, { Component } from "react";
import { string } from "prop-types";
import classNames from "classnames";

import ProgressBar from "./ProgressBar";
import play from "../icons/play.svg";
import pause from "../icons/pause.svg";

export default class AudioPlayer extends Component {
  static propTypes = {
    audioSrc: string.isRequired,
  };

  constructor(props) {
    super(props);

    this.initialPlayerState = {
      isPlaying: false,
      currentTime: "00:00",
      rawCurrentTime: 0,
    };

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    this.state = {
      rawDuration: 0,
      audioDuration: "00:00",
      ...this.initialPlayerState,
    };
  }

  componentDidMount() {
    // These event listeners keep the timer in sync with the run time of the recorded audio
    this.audio.addEventListener("timeupdate", (e) => this.timeUpdate(e));
    this.audio.addEventListener("loadedmetadata", (e) => this.loadMetaData(e));
  }

  componentDidUpdate() {
    const { isPlaying } = this.state;
    const { currentTime, duration } = this.audio;

    if (isPlaying && currentTime === duration) {
      this.pause();
    }
  }

  get player() {
    const {
      audioDuration,
      currentTime,
      rawCurrentTime,
      rawDuration,
    } = this.state;

    return (
      <div className="audio-player-main">
        <div>{currentTime}</div>
        <ProgressBar
          currentProgress={rawCurrentTime}
          maxProgress={rawDuration}
        />
        <div>{audioDuration}</div>
      </div>
    );
  }

  get icon() {
    const { isPlaying } = this.state;
    return isPlaying ? (
      <img
        src={pause}
        className={classNames("icon", "audio-player-icon")}
        alt="pause icon"
        onClick={this.pause}
      />
    ) : (
      <img
        src={play}
        className={classNames("icon", "audio-player-icon")}
        alt="play icon"
        onClick={this.play}
      />
    );
  }

  timeUpdate(event) {
    const { currentTime, duration } = event.target;

    if (currentTime === duration) {
      this.resetPlayer();
      return;
    }

    const formattedCurrent = this.convertSecondsToTime(currentTime);
    const formattedDuration = this.convertSecondsToTime(duration);

    this.setState({
      audioDuration: formattedDuration,
      currentTime: formattedCurrent,
      rawCurrentTime: currentTime,
      rawDuration: duration,
    });
  }

  loadMetaData(event) {
    const { duration } = event.target;
    const audioDuration = this.convertSecondsToTime(duration);

    this.setState({ audioDuration });
  }

  play() {
    this.setState({ isPlaying: true });

    this.audio.play();
  }

  pause() {
    this.setState({ isPlaying: false });
    this.audio.pause();
  }

  resetPlayer() {
    this.setState(this.initialPlayerState);
  }

  convertSecondsToTime(number) {
    if (!number) {
      return "00:00";
    }

    const seconds = Math.abs(number) / 60;
    const roundedSeconds = Math.round((seconds * 60) % 60);

    const minutes =
      roundedSeconds === 60
        ? Math.round(seconds)
        : seconds.toString().split(".")[0];

    const smartSeconds = roundedSeconds === 60 ? "0" : roundedSeconds;

    return `${this.makeDoubleDigit(minutes)}:${this.makeDoubleDigit(
      smartSeconds
    )}`;
  }

  makeDoubleDigit(number) {
    return number < 10 ? `0${number}` : `${number}`;
  }

  render() {
    const { audioSrc } = this.props;

    return (
      <div className="audio-player">
        {this.icon}
        {this.player}
        <audio ref={(audio) => (this.audio = audio)} src={audioSrc} />
      </div>
    );
  }
}
