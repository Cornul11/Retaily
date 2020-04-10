import React, { Component } from "react";

/** Component that displays a table with the current product information */

class ProductInfoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    this.loadTable();
  }

  componentDidUpdate() {
    if (this.props.retrieve === true) {
      this.loadTable();
    }
  }

  loadTable() {
    this.props.onLoaded();
    let url = "/product/?" + this.props.identifier + "=" + this.props.text;
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          this.setState({ data: response });
        },
        (error) => {
          this.setState({ data: {} });
        }
      );
  }

  createTable() {
    let table = [];
    Object.keys(this.state.data).forEach((key) => {
      table.push(
        <tr>
          <td>{key}</td>
          <td>{this.state.data[key]}</td>
        </tr>
      );
    });
    if (table.length === 0) {
      table.push(<h1>No data</h1>);
    }
    return table;
  }

  render() {
    return (
      <div className="productInfoTable">
        <table>{this.createTable()}</table>
      </div>
    );
  }
}

export default ProductInfoTable;
