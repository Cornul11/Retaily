import React, { Component } from "react";
import { Chart } from "chart.js";
import PropTypes from "prop-types";
import Absolute from "../Absolute";
import "./charts.css";

class SalesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: "1000",
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
    const absolute = this.context;
    const {
      identifier,
      text,
      start,
      end,
      interval,
      onError,
      onLoaded,
      saleType,
    } = this.props;
    const { multiplier } = this.state;
    let url = `${absolute ? "https://retaily.site:7000" : ""}/verkoop/?`;
    if (identifier !== null) {
      url += `${identifier}=${text}&`;
    }
    url += `start=${start}&end=${end}&interval=${interval}`;
    if (saleType === "revenue") {
      url += "&revenue";
    }
    await fetch(url, {
      method: "GET",
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
            onError("Verbinding mislukt");
          }
        });
        return null;
      })
      .then((response) => {
        if (response != null) {
          this.setState({
            data: response,
            width: (response.length * multiplier).toString(),
          });
        }
      });
    this.drawChart();
    onLoaded();
    this.setState({ loading: false });
  }

  drawChart() {
    const { interval } = this.props;
    const { chart, data } = this.state;
    if (chart !== null) {
      chart.destroy();
    }
    this.setState({
      chart: new Chart(document.getElementById("myChart").getContext("2d"), {
        type: "bar",
        data: {
          datasets: [
            {
              data,
              backgroundColor: "rgba(55,155,255,0.5)",
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
                type: "time",
                time: {
                  isoWeekday: true,
                  unit: interval === "half_an_hour" ? "hour" : interval,
                  displayFormats: {
                    hour: "D-M-YYYY    HH:mm",
                    day: "D-M-YYYY",
                    week: "D-M-YYYY (WW)",
                    month: "M-YYYY",
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
      }),
    });
  }

  zoomIn() {
    const { multiplier, width } = this.state;
    if (multiplier < 80) {
      this.setState(
        { multiplier: multiplier * 2, width: width * 2 },
        this.drawChart
      );
    }
  }

  zoomOut() {
    const { multiplier, width } = this.state;
    if (multiplier > 5) {
      this.setState(
        { multiplier: multiplier / 2, width: width / 2 },
        this.drawChart
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
            style={{ width: `${width}px`, height: "500px" }}
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
  identifier: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  saleType: PropTypes.string.isRequired,
};

export default SalesChart;
