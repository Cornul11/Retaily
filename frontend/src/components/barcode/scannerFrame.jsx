import React, { Component } from "react";
import Scanner from "./scanner";
import styles from "./scannerFrame.css";

/**
 * ScannerFrame Component used to show the camera footage
 * and references the Scanner Component that will detect
 * barcodes from the camera footage.
 */

class ScannerFrame extends Component {
  ref = React.createRef();

  async componentDidMount() {
    // Request camera footage from user.
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
