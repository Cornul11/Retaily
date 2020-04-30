import React, { Component } from "react";

/** Component that displays a table with the current product information */

class ProductInfoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getEmptyData()
    };
  }

  componentDidUpdate() {
    if (this.props.retrieve === true) {
      this.loadTable();
    }
  }
  getEmptyData() {
    if(this.props.extended){
      return(
        {
          plu: null,
          name: null,
          buying_price: null,
          selling_price: null,
          discount: null,
          sales_last_week: null,
          sales_last_month: null,
          sales_last_quarter: null,
          sales_last_year: null,
        }
      );
    }
    else{
      return (
        {
          plu: null,
          name: null,
          sales_last_week: null,
          sales_last_month: null,
          sales_last_quarter: null,
          sales_last_year: null,
        }
      );
    }
  }

  async loadTable() {
    this.props.onLoaded();
    let newData = this.getEmptyData();
    let url = "/product/?" + this.props.identifier + "=" + this.props.text;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData["plu"] = response["plu"];
          newData["name"] = response["name"];
          if(this.props.extended){
            newData["buying_price"] = response["buying_price"];
            newData["selling_price"] = response["selling_price"];
            newData["discount"] = response["discount"];
          }
        },
        (error) => {
          console.log(error);
        }
      );
    url = "/sales/quick/?" + this.props.identifier + "=" + this.props.text;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData["sales_last_week"] = response["sales_last_week"];
          newData["sales_last_month"] = response["sales_last_month"];
          newData["sales_last_quarter"] = response["sales_last_quarter"];
          newData["sales_last_year"] = response["sales_last_year"];
        },
        (error) => {
          console.log(error);
        }
      );
    this.setState({ data: newData });
  }

  renderTable() {
    let table = [];
    let index = 0;
    Object.keys(this.state.data).forEach((key) => {
      table.push(
        <thead key={index}>
          <tr key={index}>
            <th>{key}</th>
            <th>{this.state.data[key]}</th>
          </tr>
        </thead>
      );
      index++;
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