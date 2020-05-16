import React, { Component } from 'react';
import { Chart } from 'chart.js';
import './charts.css';
import './App.css';

// TODO: Proper zoom on filter
// has property url, which is called by the API
class Barchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      chart: null,
      chartJSON: [],
      desc: false,
      sort: 'name',
    };
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleDescendingToggle = this.handleDescendingToggle.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  setSort(attr) {
    this.setState({ sort: attr }, this.updateChart);
  }

  handleDescendingToggle() {
    this.setState(
      (state) => ({
        desc: !state.desc,
      }),
      this.updateChart,
    );
  }

  handleChangeFilter(event) {
    this.setState(
      { filter: event.target.value.trim().toLowerCase() },
      this.updateChart,
    );
  }

  // sorts JSON data by key
  sortJSONData(key, data) {
    const sorted = [];
    let compare = function (a, b) {
      const tempComparision = data[a][key] < data[b][key] ? -1 : 0;
      return data[a][key] > data[b][key] ? 1 : tempComparision;
    };
    if (this.state.desc) {
      compare = function (a, b) {
        const tempComparision = data[b][key] < data[a][key] ? -1 : 0;
        return data[b][key] > data[a][key] ? 1 : tempComparision;
      };
    }
    Object.keys(data)
      .sort(compare)
      .forEach((id) => {
        sorted.push(data[id]);
      });
    return sorted;
  }

  // Convert data for chart
  convertData(response) {
    const data = {
      names: [],
      values: [],
      colors: [],
    };
    const sorted = this.sortJSONData(this.state.sort, response.products);
    let count = 0;
    for (let i = 0; i < sorted.length; i += 1) {
      if (
        String(sorted[i].name.trim().toLowerCase().match(this.state.filter))
        !== String(this.state.filter)
      ) {
        continue;
      }
      if (count % 2) {
        data.colors.push('rgba(0,255,0,0.5)');
      } else {
        data.colors.push('rgba(0,0,255,0.5)');
      }
      data.names.push(sorted[i].name);
      data.values.push(sorted[i].count);
      count += 1;
    }
    return data;
  }

  // initializes the Barchart
  async initialize() {
    // Fetch API call
    await fetch(`${this.props.url}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({ chartJSON: response });
        const data = this.convertData(response);
        // Create the chart
        this.setState({
          chart: new Chart(
            document.getElementById('myChart').getContext('2d'),
            {
              type: 'bar',
              data: {
                labels: data.names,
                datasets: [
                  {
                    data: data.values,
                    backgroundColor: data.colors,
                  },
                ],
              },
              options: {
                responsive: false,
                maintainAspectRatio: false,
                responsiveAnimationDuration: 0,
                legend: {
                  display: false,
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            },
          ),
        });
      });
  }

  /* function that removes the data of the chart and sets new data
  based on the chartJSON, sort and desc state */
  updateChart() {
    const { chart } = this.state;
    if (chart == null) {
      console.log('chart is null');
      return;
    }
    // remove current data
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    // add the new data
    const data = this.convertData(this.state.chartJSON);
    chart.data.labels.push(data.names);
    chart.data = {
      labels: data.names,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.colors,
        },
      ],
    };
    chart.update();
    this.setState({ chart });
  }

  render() {
    return (
      <div>
        <div id="wrapper" className="chartWrapper">
          <canvas id="myChart" width={10000} height="500" />
        </div>
        <div className="input-group mt-2">
          <div className="btn-group" role="group">
            <button
              id="btnGroupDrop1"
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sort by
            </button>
            <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <button
                type="button"
                className={`dropdown-item ${
                  this.state.sort === String('count') ? 'active' : ''}`}
                onClick={() => {
                  this.setSort('count');
                }}
              >
                Count
              </button>
              <button
                type="button"
                className={`dropdown-item ${
                  this.state.sort === String('name') ? 'active' : ''}`}
                onClick={() => {
                  this.setSort('name');
                }}
              >
                Name
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.handleDescendingToggle}
          >
            {this.state.desc ? 'Set ascending' : 'Set descending'}
          </button>
          <input
            type="text"
            className="form-control"
            onChange={this.handleChangeFilter}
          />
        </div>
      </div>
    );
  }
}

export default Barchart;
