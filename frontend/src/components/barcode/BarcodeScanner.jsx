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
      loaded: false,
    };
    this.ref = React.createRef();
    this.onDetected = this.onDetected.bind(this);
  }

  async componentDidMount() {
    /** Request camera footage from user */
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    //   this.setState({ stream });
    // } catch (err) {
    //   return;
    // }
    // const { stream } = this.state;
    // this.ref.current.srcObject = stream;
    /** Initialize the scanner */
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            facingMode: 'environment',
            width: { min: 960 },
            height: { min: 640 },
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
    this.setState({ loaded: true });
  }

  componentWillUnmount() {
    const { loaded } = this.state;
    if (loaded) {
      Quagga.stop();
      this.setState({ loaded: false });
    }
  }

  onDetected(result) {
    const { onDetected } = this.props;
    onDetected(result.codeResult.code);
  }

  render() {
    const { loaded } = this.state;
    return (
      <div id="interactive" className={`text-center viewport${loaded ? 'posFix' : ''} `} style={styles}>
        <video id="cam" autoPlay muted playsInline />
      </div>
    );
  }
}

BarcodeScanner.propTypes = { onDetected: PropTypes.func.isRequired };

export default BarcodeScanner;
