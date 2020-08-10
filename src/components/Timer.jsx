import React, { Component } from "react";
import { bool, func } from "prop-types";
import moment from "moment";

export default class Timer extends Component {
  static propTypes = {
    isRunning: bool,
    onTimerStop: func,
    reportElapsedTime: func,
    resetTimer: bool,
  };

  static defaultProps = {
    isRunning: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      elapsedTime: "00:00",
    };
  }

  componentDidMount() {
    const { isRunning } = this.props;

    if (isRunning) {
      this.handleStart();
    }
  }

  componentDidUpdate(prevProps) {
    const { isRunning, resetTimer } = this.props;
    const { elapsedTime } = this.state;

    if (prevProps.isRunning !== isRunning) {
      if (isRunning) {
        this.handleStart();
      } else {
        this.handleStop();
      }
    }

    if (elapsedTime === this.maxTime && isRunning) {
      this.handleStop();
    }

    if (resetTimer && elapsedTime !== "00:00") {
      this.setState({ elapsedTime: "00:00" });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  handleStart() {
    this.timer = setInterval(() => {
      const { reportElapsedTime } = this.props;

      const { elapsedTime } = this.state;

      const newTime = this.formatAsTime(
        moment(elapsedTime, "mmss").add(1, "seconds")
      );

      this.setState(() => ({ elapsedTime: newTime }));

      if (reportElapsedTime) {
        const elapsedInSeconds = moment.duration(`00:${newTime}`).asSeconds();

        reportElapsedTime(elapsedInSeconds);
      }
    }, 1000);
  }

  handleStop() {
    const { onTimerStop } = this.props;

    if (this.timer) {
      clearInterval(this.timer);
    }

    if (onTimerStop) {
      onTimerStop();
    }
  }

  formatAsTime(time) {
    return time.format("mm:ss");
  }

  render() {
    const { elapsedTime } = this.state;

    return <div>{elapsedTime}</div>;
  }
}
