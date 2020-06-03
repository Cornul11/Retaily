import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const { retrieve } = this.props;
    const { loading } = this.state;
    if (retrieve === true && !loading) {
      this.loadTable();
    }
  }

  async loadTable() {
    this.setState({ loading: true });
    const {
      identifier, text, start, end, onError, onLoaded,
    } = this.props;
    const absolute = this.context;
    const encodedComponent = encodeURIComponent(text);
    const url = `${
      absolute ? 'https://retaily.site:7000' : ''
    }/koppelverkoop/lijst/?${identifier}=${encodedComponent}&start=${start}&end=${end}`;
    await fetch(url, {
      method: 'GET',
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
            onError('Verbinding mislukt');
          }
        });
        return null;
      })
      .then((response) => {
        this.setState({ data: response });
      });

    onLoaded();
    this.setState({ loading: false });
  }

  renderTable() {
    const { data } = this.state;
    if (typeof data === 'undefined' || data === null || data.length < 1) {
      return null;
    }
    const table = [];
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
KoppelVerkoopTable.propTypes = {
  retrieve: PropTypes.bool.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default KoppelVerkoopTable;
