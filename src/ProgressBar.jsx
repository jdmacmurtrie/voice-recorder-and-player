import React, { Component } from "react";
import { number, oneOfType, string } from "prop-types";

export default class ProgressBar extends Component {
  static propTypes = {
    currentProgress: oneOfType([number, string]).isRequired,
    maxProgress: oneOfType([number, string]).isRequired,
  };

  get progressBarWidth() {
    const { currentProgress, maxProgress } = this.props;

    const percentage =
      (Math.abs(currentProgress) / Math.abs(maxProgress)) * 100 || 0;
    const percentString = `${percentage}%`;

    return { width: percentString };
  }

  render() {
    return (
      <div className="progress-bar">
        <span className="progress-bar-fill" style={this.progressBarWidth} />
      </div>
    );
  }
}
