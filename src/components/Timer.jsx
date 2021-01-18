import React, { Component } from "react";
import { bool, func, string } from "prop-types";
import moment from "moment";

export default class Timer extends Component {
  static propTypes = {
    className: string,
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

    if (resetTimer && elapsedTime !== "00:00") {
      this.setState({ elapsedTime: "00:00" });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      // stops the setInterval timer
      clearInterval(this.timer);
    }
  }

  handleStart() {
    // this.timer is a function that checks in every 1000 milliseconds, (second argument).
    // This will keep the timer up to date.
    this.timer = setInterval(() => {
      const { reportElapsedTime } = this.props;
      const { elapsedTime } = this.state;

      const newTime = this.formatAsTime(
        moment(elapsedTime, "mmss").add(1, "seconds")
      );

      this.setState({ elapsedTime: newTime });

      if (reportElapsedTime) {
        // TODO this assumes the timer will not run more than an hour.  Make more flexible, at least for posterity's sake.
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
    const { className } = this.props;
    const { elapsedTime } = this.state;

    return <div className={className}>{elapsedTime}</div>;
  }
}
