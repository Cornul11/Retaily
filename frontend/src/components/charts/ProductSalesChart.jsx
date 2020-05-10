import React, { Component } from "react";
import { Chart } from "chart.js";

class ProductSalesChart extends Component {
  componentDidUpdate() {
    if (this.props.retrieve === true) {
      this.loadChart();
    }
  }

  async loadChart() {
    this.props.onLoaded();
    const url = `/sales/?${this.props.identifier}=${this.props.text}&start=${this.props.start}&end=${this.props.end}&interval=${this.props.interval}`;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({ data: response });
      });
    new Chart(document.getElementById("myChart").getContext("2d"), {
      type: "bar",
      data: {
        datasets: [
          {
            data: this.state.data,
            backgroundColor: "rgba(55,155,255,0.5)",
          },
        ],
      },
      options: {
        responsive: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit:
                  this.props.interval === "half_an_hour"
                    ? "hour"
                    : this.props.interval,
                displayFormats: {
                  hour: "HH:mm",
                  day: "D MMM",
                  week: "D MMM",
                  month: "MMM",
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
              return "";
            },
          },
        },
      },
    });
  }

  render() {
    return (
      <div className="chartWrapper">
        <canvas id="myChart" width="1000" height="500" />
      </div>
    );
  }
}

export default ProductSalesChart;
