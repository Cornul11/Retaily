import React, { Component } from 'react';
import Absolute from '../Absolute';

/** Component that displays a table with the current product information */

class KoppelVerkoopTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
    };
  }

  componentDidUpdate() {
    if (this.props.retrieve === true && !this.state.loading) {
      this.loadTable();
    }
  }

  async loadTable() {
    this.setState({ loading: true });
    const absolute = this.context;
    const url = `${absolute ? 'https://retaily.site:7000' : ''}/koppelverkoop/lijst/?${this.props.identifier}=${this.props.text}&start=${this.props.start}&end=${this.props.end}`;
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        response.text().then((text) => {
          try {
            text = JSON.parse(text);
            this.props.onError(text.message);
          } catch (error) {
            this.props.onError('Connection failed');
          }
        });
      })
      .then((response) => {
        this.setState({ data: response });
      });

    this.props.onLoaded();
    this.setState({ loading: false });
  }

  renderTable() {
    const { data } = this.state;
    if (typeof data === 'undefined' || data === null || data.length < 1) {
      return null;
    }
    const table = [];
    console.log(data);
    const newData = data.slice();
    const key = newData[0];
    table.push(
      <tr key={key.name} className="table-secondary">
        <th scope="row" colSpan="2" className="text-center">
          {key.name}
        </th>
      </tr>,
    );
    newData.splice(0, 1);
    newData.forEach((dataKey) => {
      table.push(
        <tr key={dataKey.name}>
          <th>{dataKey.name}</th>
          <td>{dataKey.count}</td>
        </tr>,
      );
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

KoppelVerkoopTable.contextType = Absolute;

export default KoppelVerkoopTable;
