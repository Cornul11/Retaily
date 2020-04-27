import React from "react";
import ReactDOM from "react-dom";
import Barchart from "./components/charts/barchart";
import ProductInfo from "./components/input/productInfo";
import NavBar from "./components/design/NavBar";

ReactDOM.render(
      <div>
        <NavBar />
        <Barchart url="/inventory/" />
      </div>, document.getElementById("root")
);