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
          Simple Product Info
        </a>
        <a
          className="btn btn-primary btn-block mb-4"
          href="/extended/productinfo"
        >
          Extended Product Info
        </a>
        <a className="btn btn-primary btn-block mb-4" href="/inventorybarchart">
          Overview of sales
        </a>
        <a className="btn btn-primary btn-block mb-4" href="/koppelverkoop">
          KoppelVerkoop
        </a>
        <a className="btn btn-primary btn-block mb-1" href="/salesinfo">
          Sales Info
        </a>
      </div>
    }
  />
);
export default HomePage;
