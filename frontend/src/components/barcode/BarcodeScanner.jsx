import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quagga from 'quagga';
import styles from './scanner.css';

/**
 * Scanner Component used to show the camera footage
 * and references the Scanner Component that will detect
 * barcodes from the camera footage.
 */

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: undefined,
    };
    this.ref = React.createRef();
    this.onDetected = this.onDetected.bind(this);
  }

  async componentDidMount() {
    /** Request camera footage from user */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.setState({ stream });
    } catch (err) {
      return;
    }
    const { stream } = this.state;
    this.ref.current.srcObject = stream;
    /** Initialize the scanner */
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.getElementById('camera'),
          constraints: {
            width: 960,
            height: 640,
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['ean_reader'],
        },
      },
      (err) => {
        if (err) {
          return;
        }
        Quagga.start();
      },
    );
    Quagga.onDetected(this.onDetected);
  }

  componentWillUnmount() {
    const { stream } = this.state;
    if (stream !== undefined) {
      Quagga.stop();
    }
  }

  onDetected(result) {
    const { onDetected } = this.props;
    onDetected(result.codeResult.code);
  }

  render() {
    return (
      <div style={styles}>
        <video muted id="camera" width="480" height="320" ref={this.ref} autoPlay />
      </div>
    );
  }
}

BarcodeScanner.propTypes = { onDetected: PropTypes.func.isRequired };

export default BarcodeScanner;
