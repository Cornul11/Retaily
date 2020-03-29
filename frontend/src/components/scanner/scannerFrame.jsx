import React, { Component } from "react";
import Scanner from "./scanner";
import styles from "./scannerFrame.css";

class ScannerFrame extends Component {
  ref = React.createRef();

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.ref.current.srcObject = stream;
  }

  render() {
    return (
      <div style={styles}>
        <video
          id="scannerFrame"
          width="480"
          height="320"
          ref={this.ref}
          autoPlay
        />
        <Scanner />
      </div>
    );
  }
}

export default ScannerFrame;
