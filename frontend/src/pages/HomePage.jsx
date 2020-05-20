import React from "react";
import BlueprintPage from "./BlueprintPage";

const HomePage = () => (
  <BlueprintPage
    content={
      <div>
        <a
          className="btn btn-primary btn-block mb-4"
          href="/simple/productinfo"
        >
          Standaard Product Info
        </a>
        <a
          className="btn btn-primary btn-block mb-4"
          href="/extended/productinfo"
        >
          Uitgebreide Product Info
        </a>
        <a className="btn btn-primary btn-block mb-1" href="/salesinfo">
          Transactie Informatie
        </a>
      </div>
    }
  />
);
export default HomePage;
