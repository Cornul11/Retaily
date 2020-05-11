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

  getEmptyData() {
    return {
      plu: null,
      name: null,
    };
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
    if (this.state.data == null) {
      return null;
    }
    const table = [];
    this.state.data.forEach((key) => {
      table.push(
        <tr key={key.name}>
          <th>{key.name}</th>
          <td>{key.count}</td>
        </tr>
      );
    });
    console.log("test");
    return table;
  }

  render() {
    return (
      <div className="koppelVerkoopTable">
        <table className="table table-bordered">
          <tbody>{this.renderTable()}</tbody>
        </table>
      </div>
    );
  }
}

export default KoppelVerkoopTable;
