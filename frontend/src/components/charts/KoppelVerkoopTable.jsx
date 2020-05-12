import React, { Component } from "react";

/** Component that displays a table with the current product information */

class KoppelVerkoopTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidUpdate() {
    if (this.props.retrieve === true) {
      this.loadTable();
    }
  }

  async loadTable() {
    this.props.onLoaded();
    let url = `/koppelverkoop/lijst/?${this.props.identifier}=${this.props.text}&start=${this.props.start}&end=${this.props.end}`;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          this.setState({ data: response });
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  renderTable() {
    if (this.state.data == null || this.state.data.length < 1) {
      return null;
    }
    const table = [];
    let index = 0;
    let data = this.state.data.slice();
    let key = data[0];
    table.push(
      <tr key={key.name} className="table-secondary">
        <th scope="row" colspan="2" className="text-center">
          {key.name}
        </th>
      </tr>
    );
    data.splice(0, 1);
    data.forEach((key) => {
      table.push(
        <tr key={key.name}>
          <th>{key.name}</th>
          <td>{key.count}</td>
        </tr>
      );
      index++;
    });
    return table;
  }

  render() {
    return (
      <div className="koppelVerkoopTable">
        <table className="table table-striped table-bordered table-sm">
          <tbody>{this.renderTable()}</tbody>
        </table>
      </div>
    );
  }
}

export default KoppelVerkoopTable;
