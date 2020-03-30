import React, { Component } from "react";
import Quagga from "quagga";

/**
 * Scanner Component retrieves barcodes from element
 * with id="scannerFrame". When a barcode is detected,
 * an alert will be shown that displays the found code.
 */

class Scanner extends Component {
  componentDidMount() {
    // Initialize the scanner.
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.getElementById("scannerFrame"),
          constraints: {
            width: 480,
            height: 320,
            facingMode: "environment"
          }
        },
        decoder: {
          readers: ["code_128_reader"]
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
      }
    );
    // Determine what should happen when code is detected.
    Quagga.onDetected(function(result) {
      alert(result.codeResult.code);
    });
  }

  componentWillUnmount() {
    Quagga.stop();
  }

  render() {
    return <div id="scanner" />;
  }
}

export default Scanner;
