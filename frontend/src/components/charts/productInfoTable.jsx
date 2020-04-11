import React, { Component } from "react";

/** Component that displays a table with the current product information */

class ProductInfoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        plu: null,
        name: null,
        buying_price: null,
        selling_price: null,
        discount: null,
        count: null,
      },
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

  async loadTable() {
    this.props.onLoaded();
    let newData = {
      plu: null,
      name: null,
      buying_price: null,
      selling_price: null,
      discount: null,
      count: null,
    };
    let url = "/product/?" + this.props.identifier + "=" + this.props.text;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData["plu"] = response["plu"];
          newData["name"] = response["name"];
          newData["buying_price"] = response["buying_price"];
          newData["selling_price"] = response["selling_price"];
          newData["discount"] = response["discount"];
        },
        (error) => {
          console.log(error);
        }
      );
    url = "/inventory/?" + this.props.identifier + "=" + this.props.text;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData["plu"] = response["plu"];
          newData["name"] = response["name"];
          newData["count"] = response["count"];
        },
        (error) => {
          console.log(error);
        }
      );
    this.setState({ data: newData });
  }

  renderTable() {
    let table = [];
    Object.keys(this.state.data).forEach((key) => {
      table.push(
        <tr>
          <td>{key}</td>
          <td>{this.state.data[key]}</td>
        </tr>
      );
    });
    return table;
  }

  render() {
    return (
      <div className="productInfoTable">
        <table>{this.renderTable()}</table>
      </div>
    );
  }
}

export default ProductInfoTable;
