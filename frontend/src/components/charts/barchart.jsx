import React, {Component} from "react";
import {Chart} from "chart.js";
import "./charts.css";
import './App.css';

class Barchart extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.chartJSON = [];
    this.desc = false;
    this.sort = 'name';
  }

  setSort(attr) {
    this.sort = attr;
    this.changeChartData();
  }

  setDesc(set) {
    this.desc = set;
    this.changeChartData();
  }

  componentDidMount() {
    this.initialize('name', true);
  }

  //sorts JSON data by key
  sortJSONData(key, data) {
    let sorted = [];
    let compare = function (a, b) {
      return (data[a][key] > data[b][key]) ? 1 : ((data[a][key] < data[b][key]) ? -1 : 0);
    };
    if (this.desc) {
      compare = function (a, b) {
        return (data[b][key] > data[a][key]) ? 1 : ((data[b][key] < data[a][key]) ? -1 : 0);
      }
    }
    Object.keys(data).sort(compare).forEach(function (id) {
      sorted.push(data[id]);
    });
    return sorted;
  }

  // Convert data for chart
  convertData(response) {
    let data = {
      names: [],
      values: [],
      colors: [],
    };
    let sorted = this.sortJSONData(this.sort, response.products);
    for (let i = 0; i < sorted.length; i++) {
      if (i % 2) {
        data.colors.push("rgba(0,255,0,0.5)");
      } else {
        data.colors.push("rgba(0,0,255,0.5)");
      }
      data.names.push(sorted[i].name);
      data.values.push(sorted[i].count);
    }
    return data;
  }

  //initializes the Barchart
  initialize() {
    // Fetch API call
    fetch("/inventory/", {
      method: "GET",
    })
        .then((response) => response.json())
        .then((response) => {
          this.chartJSON = response;
          let data = this.convertData(response);
          // Create the chart
          this.chart = new Chart(document.getElementById("myChart").getContext("2d"), {
            type: "bar",
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
          });
        });
  }

  /*function that removes the data of the chart and sets new data
  based on the chartJSON, sort and desc properties*/
  changeChartData() {
    //remove current data
    this.chart.data.labels.pop();
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    //add the new data
    let data = this.convertData(this.chartJSON, this.sort, this.desc);
    this.chart.data.labels.push(data.names);
    this.chart.data = {
      labels: data.names,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.colors,
        },
      ],
    }
    console.log(data);
    this.chart.update();
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light static-top mb-5 shadow">
            <div className="container">
              <a className="navbar-brand" href="/">Shop toolkit</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                      aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                      <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item active">
                      <a className="nav-link" href="/products">Products sold</a>
                    </li>
                    <li className="nav-item active">
                      <a className="nav-link" href="https://google.com">Google</a>
                    </li>
                  </ul>
                </div>
            </div>
          </nav>
          <div className="container">
            <div className="card border-0 shadow my-5">
              <div className="card-body p-5">
                <div className="chartWrapper">
                  <canvas id="myChart" width="10000" height="500"/>
                  <button onClick={() => {
                    this.setSort('count')
                  }}>Sort by count
                  </button>
                  <button onClick={() => {
                    this.setSort('name')
                  }}>Sort by name
                  </button>
                  <button onClick={() => {
                    this.setDesc(!this.desc)
                  }}>Toggle Descending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default Barchart;
