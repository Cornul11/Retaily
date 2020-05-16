import React, { Component } from 'react';
import { Chart } from 'chart.js';
import Absolute from '../Absolute';

class ProductSalesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '1000',
      chart: null,
      loading: false,
    };
  }

  componentDidUpdate() {
    if (this.props.retrieve === true && !this.state.loading) {
      this.loadChart();
    }
  }

  async loadChart() {
    this.setState({ loading: true });
    const absolute = this.context;
    const url = `${absolute ? 'https://retaily.site:7000' : ''}/sales/?${this.props.identifier}=${this.props.text}&start=${this.props.start}&end=${this.props.end}&interval=${this.props.interval}`;
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        response.text().then((text) => {
          try {
            text = JSON.parse(text);
            this.props.onError(text.message);
          } catch (error) {
            this.props.onError('Connection failed');
          }
        });
      }).then((response) => {
        if (response != null) {
          this.setState({
            data: response,
            width: (response.length * 40).toString(),
          });
        }
      });
    if (this.state.chart !== null) {
      this.state.chart.destroy();
    }
    this.state.chart = new Chart(
      document.getElementById('myChart').getContext('2d'),
      {
        type: 'bar',
        data: {
          datasets: [
            {
              data: this.state.data,
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
                    this.props.interval === 'half_an_hour'
                      ? 'hour'
                      : this.props.interval,
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
    this.props.onLoaded();
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="chartWrapper">
        <div
          className="chartWrapper2"
          style={{ width: `${this.state.width}px`, height: '500px' }}
        >
          <canvas id="myChart" />
        </div>
      </div>
    );
  }
}
ProductSalesChart.contextType = Absolute;

export default ProductSalesChart;
