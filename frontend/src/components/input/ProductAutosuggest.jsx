import React, { Component } from "react";
import Autosuggest from "react-autosuggest";

const products = [];

const escapeRegexCharacters = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSuggestions = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }

  const regex = new RegExp(`^${escapedValue}`, "i");

  return products.filter((product) => regex.test(product.name));
};

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => <span>{suggestion.name}</span>;

/**
 * Decides whether to show suggestions or not.
 * Returns true only if the input size is larger than 2.
 * @param value the input of the user
 * @returns {boolean} whether to show the suggestions
 */
function shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}

const ProductAutosuggest = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.fillProductsArray();
  }

  handleTextChange(event) {
    this.props.onTextChange(event);
  }

  async fillProductsArray() {
    await fetch("localhost:5000/inventory/list", {
      method: "GET",
    })
      .then((response) => response.json())
      .then(
        (response) => {
          for (const product in response) {
            products.push(response[product]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelectedByUser = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.props.onTextChangeAuto(suggestionValue);
  };

  render() {
    const value = this.props.text;
    const { suggestions } = this.state;
    const inputProps = {
      placeholder: "Test input",
      value,
      onChange: this.handleTextChange,
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestionSelectedByUser}
        inputProps={inputProps}
      />
    );
  }
};

export default ProductAutosuggest;
