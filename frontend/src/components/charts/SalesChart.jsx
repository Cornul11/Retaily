import React, { Component } from 'react';
import { Chart } from 'chart.js';
import PropTypes from 'prop-types';
import Absolute from '../Absolute';
import './charts.css';

class SalesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '1000',
      chart: null,
      loading: false,
      multiplier: 20,
    };
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  componentDidUpdate() {
    const { retrieve } = this.props;
    const { loading } = this.state;
    if (retrieve && !loading) {
      this.loadChart();
    }
  }

  async loadChart() {
    this.setState({ loading: true });
    const { multiplier } = this.state;
    const { onLoaded } = this.props;
    const url = this.createURL();
    const data = await this.fetchData(url);
    if (data != null) {
      this.setState({
        data, width: (data.length * multiplier).toString(),
      });
      this.roundData();
      this.drawChart();
    }
    onLoaded();
    this.setState({ loading: false });
  }

  roundData() {
    const { data } = this.state;
    const roundedData = data;
    for (let i = 0; i < roundedData.length; i += 1) {
      roundedData[i].y = roundedData[i].y.toFixed(2);
    }
    this.setState({ data: roundedData });
  }

  drawChart() {
    const { interval } = this.props;
    const { chart, data } = this.state;
    if (chart !== null) {
      chart.destroy();
    }
    this.setState({
      chart: new Chart(document.getElementById('myChart').getContext('2d'), {
        type: 'bar',
        data: {
          datasets: [
            {
              data,
              backgroundColor: 'rgba(55,155,255,0.5)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  isoWeekday: true,
                  unit: interval === 'half_an_hour' ? 'hour' : interval,
                  displayFormats: {
                    hour: 'D-M-YYYY    HH:mm',
                    day: 'D-M-YYYY',
                    week: 'D-M-YYYY (WW)',
                    month: 'M-YYYY',
                  },
                },
                offset: true,
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              title() {
                return '';
              },
            },
          },
        },
      }),
    });
  }

  async fetchData(url) {
    const { onError } = this.props;
    try {
      const result = await fetch(url, {
        method: 'GET',
      });
      const data = await result.json();
      return data;
    } catch (e) {
      onError('Verbinding mislukt');
      return null;
    }
  }

  createURL() {
    const absolute = this.context;
    const {
      identifier,
      text,
      start,
      end,
      interval,
      saleType,
    } = this.props;
    let url = `${absolute ? 'https://retaily.site:7000' : ''}/verkoop/?`;
    if (identifier !== null) {
      url += `${identifier}=${text}&`;
    }
    url += `start=${start}&end=${end}&interval=${interval}`;
    if (saleType === 'revenue') {
      url += '&revenue';
    }
    return url;
  }

  zoomIn() {
    const { multiplier, width } = this.state;
    if (multiplier < 80) {
      this.setState(
        { multiplier: multiplier * 2, width: width * 2 },
        this.drawChart,
      );
    }
  }

  zoomOut() {
    const { multiplier, width } = this.state;
    if (multiplier > 5) {
      this.setState(
        { multiplier: multiplier / 2, width: width / 2 },
        this.drawChart,
      );
    }
  }

  render() {
    const { width } = this.state;
    return (
      <div>
        <div className="chartWrapper" role="textbox">
          <div
            className="chartWrapper2"
            style={{ width: `${width}px`, height: '500px' }}
          >
            <canvas id="myChart" />
          </div>
        </div>
        <div className="input-group mt-2">
          <button
            type="button"
            className="btn btn-secondary form-control mr-sm-2 mr-1"
            onClick={this.zoomOut}
          >
            Zoom uit (-)
          </button>
          <button
            type="button"
            className="btn btn-secondary form-control ml-sm-2 ml-1"
            onClick={this.zoomIn}
          >
            Zoom in (+)
          </button>
        </div>
      </div>
    );
  }
}

SalesChart.contextType = Absolute;
SalesChart.propTypes = {
  retrieve: PropTypes.bool.isRequired,
  identifier: PropTypes.string,
  text: PropTypes.string,
  onLoaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  saleType: PropTypes.string.isRequired,
};

SalesChart.defaultProps = {
  identifier: PropTypes.string,
  text: PropTypes.string,
};

export default SalesChart;
