import React from "react";
import BlueprintPage from "./BlueprintPage";

const HomePage = () => (
  <BlueprintPage
    content={
      <div>
        <a
          className="btn btn-primary btn-block mb-4"
          href="/standaard/productinfo"
        >
          Standaard Product Info
        </a>
        <a
          className="btn btn-primary btn-block mb-4"
          href="/uitgebreide/productinfo"
        >
          Uitgebreide Product Info
        </a>
        <a
          className="btn btn-primary btn-block mb-1"
          href="/transactie_informatie"
        >
          Transactie Informatie
        </a>
      </div>
    }
  />
);
export default HomePage;
