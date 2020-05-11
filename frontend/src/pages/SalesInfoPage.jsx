import React, { Component } from "react";
import SalesInfoWrapper from "../components/input/wrappers/SalesInfoWrapper";
import BlueprintPage from "./BlueprintPage";

class SalesInfoPage extends Component {
  render() {
    return <BlueprintPage content={<SalesInfoWrapper />} />;
  }
}
export default SalesInfoPage;
