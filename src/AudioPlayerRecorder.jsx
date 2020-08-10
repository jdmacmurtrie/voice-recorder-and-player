import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import AudioPlayer from "./AudioPlayer";
import VoiceRecorder from "./VoiceRecorder";

export default class AudioPlayerRecorder extends Component {
  static propTypes = {
    audio: PropTypes.string,
    onSave: PropTypes.func,
    reportRecordedAudio: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.baseClass = "bve-audio-player-recorder";

    this.handleSave = this.handleSave.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.resetRecording = this.resetRecording.bind(this);

    this.state = {
      audio: "",
    };
  }

  componentDidMount() {
    const { audio } = this.props;

    if (audio) {
      this.loadAudio();
    }
  }

  componentDidUpdate(prevProps) {
    const { audio } = this.props;

    if (prevProps.audio !== audio) {
      this.loadAudio();
    }
  }

  loadAudio() {
    const { audio } = this.props;

    this.setState(() => ({ audio }));
  }

  stopRecording(recordedAudio) {
    const { reportRecordedAudio } = this.props;

    this.setState(() => ({ audio: recordedAudio }));

    if (reportRecordedAudio) {
      reportRecordedAudio(recordedAudio);
    }
  }

  resetRecording() {
    this.setState(() => ({ audio: "" }));
  }

  handleSave() {
    const { onSave } = this.props;

    if (onSave) {
      onSave();
    }
  }

  get postRecordingButtons() {
    return (
      <div className={`${this.baseClass}-post-recording-buttons`}>
        <button modifier="anchor" onClick={this.resetRecording}>
          Re-Record
        </button>
        <button modifier="primary" onClick={this.handleSave}>
          Save
        </button>
      </div>
    );
  }

  render() {
    const { audio } = this.state;

    return (
      <div className={this.baseClass}>
        {audio ? (
          <Fragment>
            <AudioPlayer audio={audio} />
            {this.postRecordingButtons}
          </Fragment>
        ) : (
          <VoiceRecorder
            {...this.props}
            onRecordStop={this.stopRecording}
            maxRecordingTime="00:10"
          />
        )}
      </div>
    );
  }
}
