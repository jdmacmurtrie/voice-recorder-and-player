import React, { Component } from "react";
import { bool, func, number, oneOfType, string } from "prop-types";
import moment from "moment";

export default class Timer extends Component {
  static propTypes = {
    isRunning: bool,
    maxTime: oneOfType([number, string]).isRequired,
    maxTimeWarning: oneOfType([number, string]),
    onTimerStop: func,
    reportElapsedTime: func,
  };

  static defaultProps = {
    isRunning: false,
  };

  constructor(props) {
    super(props);

    /*
      The maxTime prop can be either formatted either as a single number representing minutes, or as "minutes:seconds".
      If a single number is passed, it may be either a string or a number.
    */
    this.maxTime = this.formatAsTime(moment(props.maxTime, "mmss"));

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
    const { isRunning } = this.props;
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

  get warningActive() {
    const { maxTimeWarning } = this.props;
    const { elapsedTime } = this.state;

    const secondsRemaining =
      moment.duration(`00:${this.maxTime}`).asSeconds() -
      moment.duration(`00:${elapsedTime}`).asSeconds();

    return secondsRemaining <= maxTimeWarning;
  }

  render() {
    const { maxTimeWarning } = this.props;
    const { elapsedTime } = this.state;

    const warningClass =
      maxTimeWarning && this.warningActive ? "warning" : undefined;

    return <div className={warningClass}>{elapsedTime}</div>;
  }
}
