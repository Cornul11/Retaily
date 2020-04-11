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
    for (let i = 0; i < response.products.length; i++) {
      if (i % 2) {
        data.colors.push("rgba(0,255,0,0.5)");
      } else {
        data.colors.push("rgba(0,0,255,0.5)");
      }
      data.names.push(response.products[i].name);
      data.values.push(response.products[i].count);
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
