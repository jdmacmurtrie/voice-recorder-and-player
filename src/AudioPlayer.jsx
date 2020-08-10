import React, { Component } from "react";
import PropTypes from "prop-types";

import ProgressBar from "./ProgressBar";

export default class AudioPlayer extends Component {
  static propTypes = {
    audio: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.baseClass = "bve-audio-player";

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
    const { audio } = this.props;

    if (audio) {
      this.loadAudio();
    }

    this.audio.addEventListener("timeupdate", (e) => this.timeUpdate(e));
    this.audio.addEventListener("loadedmetadata", (e) => this.loadMetaData(e));
  }

  componentDidUpdate(prevProps) {
    const { audio } = this.props;
    const { isPlaying } = this.state;
    const { currentTime, duration } = this.audio;

    if (isPlaying && currentTime === duration) {
      this.pause();
    }

    if (prevProps.audio !== audio) {
      this.loadAudio();
    }
  }

  loadAudio() {
    const { audio } = this.props;

    this.setState(() => ({ audioSrc: audio }));
  }

  timeUpdate(e) {
    const { currentTime, duration } = e.target;

    if (currentTime === duration) {
      this.resetPlayer();
      return;
    }

    const formattedCurrent = this.convertSecondsToTime(currentTime);
    const formattedDuration = this.convertSecondsToTime(duration);

    this.setState(() => ({
      audioDuration: formattedDuration,
      currentTime: formattedCurrent,
      rawCurrentTime: currentTime,
      rawDuration: duration,
    }));
  }

  loadMetaData(e) {
    const { duration } = e.target;
    const audioDuration = this.convertSecondsToTime(duration);

    this.setState(() => ({ audioDuration }));
  }

  play() {
    this.setState(() => ({ isPlaying: true }));

    this.audio.play();
  }

  pause() {
    this.setState(() => ({ isPlaying: false }));
    this.audio.pause();
  }

  resetPlayer() {
    this.setState(() => ({
      ...this.initialPlayerState,
    }));
  }

  renderPlaybackTime(text) {
    return (
      <div className={`${this.baseClass}-playback-time`} size="m" type="body">
        {text}
      </div>
    );
  }

  renderIcon(name, onClick) {
    return (
      <button
        className={`${this.baseClass}-icon`}
        description={`${name} icon`}
        fill="primary"
        name={name}
        onClick={onClick}
      />
    );
  }

  convertSecondsToTime(number) {
    if (!number) {
      return "";
    }
    const seconds = Math.abs(number) / 60;
    const sec = Math.round((seconds * 60) % 60);
    const min =
      sec === 60 ? Math.round(seconds) : seconds.toString().split(".")[0];
    const minute = min > 4 ? "4" : min;
    const smartSeconds = sec === 60 || minute === "4" ? "0" : sec;
    return `${this.makeDoubleDigit(minute)}:${this.makeDoubleDigit(
      smartSeconds
    )}`;
  }

  makeDoubleDigit(number) {
    return number < 10 ? `0${number}` : `${number}`;
  }

  get player() {
    const {
      audioDuration,
      currentTime,
      rawCurrentTime,
      rawDuration,
    } = this.state;

    return (
      <div className={`${this.baseClass}-playback-progress`}>
        <div className={`${this.baseClass}-play-timers`}>
          {this.renderPlaybackTime(currentTime)}
          {this.renderPlaybackTime(audioDuration)}
        </div>
        <ProgressBar
          currentProgress={rawCurrentTime}
          maxProgress={rawDuration}
        />
      </div>
    );
  }

  render() {
    const { audioSrc, isPlaying } = this.state;

    return (
      <div className={this.baseClass}>
        {isPlaying
          ? this.renderIcon("pause", this.pause)
          : this.renderIcon("play", this.play)}
        {this.player}
        <audio ref={(audio) => (this.audio = audio)} src={audioSrc} />
      </div>
    );
  }
}
