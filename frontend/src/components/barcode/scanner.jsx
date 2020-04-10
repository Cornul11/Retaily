import React, { Component } from "react";
import Quagga from "quagga";
import styles from "./scanner.css";

/**
 * Scanner Component used to show the camera footage
 * and references the Scanner Component that will detect
 * barcodes from the camera footage.
 */

class Scanner extends Component {
  ref = React.createRef();

  async componentDidMount() {
    // Request camera footage from user.
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.ref.current.srcObject = stream;
    // Initialize the scanner.
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.getElementById("camera"),
          constraints: {
            width: 480,
            height: 320,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
      }
    );
    // Determine what should happen when code is detected.
    Quagga.onDetected(function (result) {
      document.getElementById("testtext").value = result.codeResult.code;
      alert(result.codeResult.code);
    });
  }

  componentWillUnmount() {
    Quagga.stop();
  }

  render() {
    return (
      <div style={styles}>
        <video id="camera" width="480" height="320" ref={this.ref} autoPlay />
      </div>
    );
  }
}

export default Scanner;
