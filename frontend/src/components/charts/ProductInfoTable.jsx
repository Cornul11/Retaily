import React, { Component } from "react";
import PropTypes from "prop-types";
import Absolute from "../Absolute";

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
        PLU: null,
        Naam: null,
        Inkoopprijs: null,
        Verkoopprijs: null,
        Winstmarge: null,
        "Verkocht afgelopen week": null,
        "Verkocht afgelopen maand": null,
        "Verkocht afgelopen kwartaal": null,
        "Verkocht afgelopen jaar": null,
      };
    }
    return {
      PLU: null,
      Naam: null,
      "Verkocht afgelopen week": null,
      "Verkocht afgelopen maand": null,
      "Verkocht afgelopen kwartaal": null,
      "Verkocht afgelopen jaar": null,
    };
  }

  async loadTable() {
    this.setState({ loading: true });
    const newData = this.getEmptyData();
    const { extended, identifier, text, onError, onLoaded } = this.props;
    const absolute = this.context;
    let url = `${
      absolute ? "https://retaily.site:7000" : ""
    }/product/?${identifier}=${text}`;
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
          newData.PLU = response.plu;
          newData.Naam = response.name;
          if (extended) {
            newData.Inkoopprijs = response.buying_price;
            newData.Verkoopprijs = response.selling_price;
            newData.Winstmarge = `${((newData.Inkoopprijs / newData.Verkoopprijs) * 100).toFixed(2)}%`;
          }
        }
      });
    url = `${
      absolute ? "https://retaily.site:7000" : ""
    }/verkoop/kort/?${identifier}=${text}`;
    await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          newData["Verkocht afgelopen week"] = response.sales_last_week;
          newData["Verkocht afgelopen maand"] = response.sales_last_month;
          newData["Verkocht afgelopen kwartaal"] = response.sales_last_quarter;
          newData["Verkocht afgelopen jaar"] = response.sales_last_year;
        },
        (error) => {
          console.log(error);
        }
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
        </tr>
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

ProductInfoTable.propTypes = {
  extended: PropTypes.bool.isRequired,
  retrieve: PropTypes.bool.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default ProductInfoTable;
