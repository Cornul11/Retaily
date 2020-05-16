import React, { Component } from 'react';
import { Chart } from 'chart.js';
import PropTypes from 'prop-types';
import Absolute from '../Absolute';

class SalesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '1000',
      chart: null,
      loading: false,
    };
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
    const absolute = this.context;
    const {
      start, end, interval, onError, onLoaded,
    } = this.props;
    const url = `${absolute ? 'https://retaily.site:7000' : ''}/sales/?start=${start}&end=${end}&interval=${interval}`;
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        response.text().then((msg) => {
          try {
            const parsed = JSON.parse(msg);
            onError(parsed.message);
          } catch (error) {
            onError('Connection failed');
          }
        });
        return null;
      }).then((response) => {
        if (response != null) {
          this.setState({
            data: response,
            width: (response.length * 40).toString(),
          });
        }
      });
    const { chart, data } = this.state;
    if (chart !== null) {
      chart.destroy();
    }
    this.state.chart = new Chart(
      document.getElementById('myChart').getContext('2d'),
      {
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
                  unit:
                    interval === 'half_an_hour'
                      ? 'hour'
                      : interval,
                  displayFormats: {
                    hour: 'HH:mm',
                    day: 'D MMM',
                    week: 'D MMM',
                    month: 'MMM',
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
      },
    );
    onLoaded();
    this.setState({ loading: false });
  }

  render() {
    const { width } = this.state;
    return (
      <div className="chartWrapper">
        <div
          className="chartWrapper2"
          style={{ width: `${width}px`, height: '500px' }}
        >
          <canvas id="myChart" />
        </div>
      </div>
    );
  }
}

SalesChart.contextType = Absolute;
SalesChart.propTypes = { retrieve: PropTypes.bool.isRequired };
SalesChart.propTypes = { onLoaded: PropTypes.func.isRequired };
SalesChart.propTypes = { onError: PropTypes.func.isRequired };
SalesChart.propTypes = { start: PropTypes.string.isRequired };
SalesChart.propTypes = { end: PropTypes.string.isRequired };
SalesChart.propTypes = { interval: PropTypes.string.isRequired };


export default SalesChart;
