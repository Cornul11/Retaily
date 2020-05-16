import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Absolute from '../Absolute';

/** Component that displays a table with the current product information */

class ProductInfoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getEmptyData(),
      loading: false,
    };
  }

  componentDidUpdate() {
    const { retrieve } = this.props;
    const { loading } = this.state;
    if (retrieve && !loading) {
      this.loadTable();
    }
  }

  getEmptyData() {
    const { extended } = this.props;
    if (extended) {
      return {
        plu: null,
        name: null,
        buying_price: null,
        selling_price: null,
        discount: null,
        sales_last_week: null,
        sales_last_month: null,
        sales_last_quarter: null,
        sales_last_year: null,
      };
    }
    return {
      plu: null,
      name: null,
      sales_last_week: null,
      sales_last_month: null,
      sales_last_quarter: null,
      sales_last_year: null,
    };
  }

  async loadTable() {
    this.setState({ loading: true });
    const newData = this.getEmptyData();
    const {
      extended, identifier, text, onError, onLoaded,
    } = this.props;
    const absolute = this.context;
    let url = `${absolute ? 'https://retaily.site:7000' : ''}/product/?${identifier}=${text}`;
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
            onError('Connection failed');
          }
        });
        return null;
      })
      .then((response) => {
        if (response != null) {
          newData.plu = response.plu;
          newData.name = response.name;
          if (extended) {
            newData.buying_price = response.buying_price;
            newData.selling_price = response.selling_price;
            newData.discount = response.discount;
          }
        }
      });
    url = `${absolute ? 'https://retaily.site:7000' : ''}/sales/quick/?${identifier}=${text}`;
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData.sales_last_week = response.sales_last_week;
          newData.sales_last_month = response.sales_last_month;
          newData.sales_last_quarter = response.sales_last_quarter;
          newData.sales_last_year = response.sales_last_year;
        },
        (error) => {
          console.log(error);
        },
      );
    onLoaded();
    this.setState({ data: newData, loading: false });
  }

  renderTable() {
    const table = [];
    let index = 0;
    const { data } = this.state;
    Object.keys(data).forEach((key) => {
      table.push(
        <tr key={index}>
          <th scope="row">{key}</th>
          <td>{data[key]}</td>
        </tr>,
      );
      index += 1;
    });
    return table;
  }

  render() {
    return (
      <div className="productInfoTable">
        <table className="table table-striped table-bordered table-sm">
          <tbody>{this.renderTable()}</tbody>
        </table>
      </div>
    );
  }
}

ProductInfoTable.contextType = Absolute;
ProductInfoTable.propTypes = { extended: PropTypes.bool.isRequired };
ProductInfoTable.propTypes = { retrieve: PropTypes.bool.isRequired };
ProductInfoTable.propTypes = { onLoaded: PropTypes.func.isRequired };
ProductInfoTable.propTypes = { onError: PropTypes.func.isRequired };
ProductInfoTable.propTypes = { identifier: PropTypes.string.isRequired };
ProductInfoTable.propTypes = { text: PropTypes.string.isRequired };

export default ProductInfoTable;
