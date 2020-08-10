import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ProgressBar extends Component {
  static propTypes = {
    currentProgress: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    maxProgress: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
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
      <div className="bve-progress-bar">
        <span className="bve-progress-bar-fill" style={this.progressBarWidth} />
      </div>
    );
  }
}
