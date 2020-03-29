import React, { Component } from "react";
import Quagga from "quagga";

class Scanner extends Component {
  componentDidMount() {
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
