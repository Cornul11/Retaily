import React, { Component } from 'react';

/** Component that displays a table with the current product information */

class KoppelVerkoopTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getEmptyData(),
    };
  }

  componentDidUpdate() {
    if (this.props.retrieve === true) {
      this.loadTable();
    }
  }

  getEmptyData() {
    return (
      {
        plu: null,
        name: null,
      }
    );
  }

  async loadTable() {
    this.props.onLoaded();
    const newData = this.getEmptyData();
    const url = `/product/?${this.props.identifier}=${this.props.text}`;
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData.plu = response.plu;
          newData.name = response.name;
        },
        (error) => {
          console.log(error);
        },
      );
    /*
    url = "/koppelverkoop/lijst/?" + this.props.identifier + "=" + this.props.text;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData["1"] = response["sales_last_week"];
          newData["2"] = response["sales_last_month"];
          newData["3"] = response["sales_last_quarter"];
          newData["4"] = response["sales_last_year"];
          newData["5"] = response["sales_last_year"];
        },
        (error) => {
          console.log(error);
        }
      );
    */
    this.setState({ data: newData });
  }

  renderTable() {
    const table = [];
    let index = 0;
    Object.keys(this.state.data).forEach((key) => {
      table.push(
        <thead key={index}>
          <tr key={index}>
            <th scope="row">{key}</th>
            <th scope="row">{this.state.data[key]}</th>
          </tr>
        </thead>,
      );
      index += 1;
    });
    return table;
  }

  render() {
    return (
      <div className="koppelVerkoopTable">
        <table className="table table-bordered">{this.renderTable()}</table>
      </div>
    );
  }
}

export default KoppelVerkoopTable;
