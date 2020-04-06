import React, { Component } from "react";
import { Chart } from "chart.js";
import "./charts.css";

class Barchart extends Component {
  // Convert data for chart
  convertData(response) {
    let data = {
      names: [],
      values: [],
      colors: [],
    };
    let length = response.products.length;
    if (length > 0) {
      let currentName = response.products[0].name;
      let count = 1;
      let i = 1;
      while (i < length) {
        if (i % 2) {
          data.colors.push("rgba(0,255,0,0.5)");
        } else {
          data.colors.push("rgba(0,0,255,0.5)");
        }
        if (currentName === response.products[i].name) {
          count++;
        } else {
          data.names.push(currentName + "(" + count + ")");
          data.values.push(count);
          currentName = response.products[i].name;
          count = 1;
        }
        i++;
      }
      data.names.push(currentName);
      data.values.push(count);
    }
    return data;
  }

  componentDidMount() {
    // Fetch API call
    fetch("/inventory/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        let data = this.convertData(response);
        // Create the chart
        new Chart(document.getElementById("myChart").getContext("2d"), {
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

  render() {
    return (
      <div className="chartWrapper">
        <canvas id="myChart" width="10000" height="500"></canvas>
      </div>
    );
  }
}

export default Barchart;
