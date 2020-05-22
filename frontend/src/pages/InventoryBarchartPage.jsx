import React, { useContext } from "react";
import Barchart from "../components/charts/Barchart";
import BlueprintPage from "./BlueprintPage";
import Absolute from "../components/Absolute";

const InventoryBarchartPage = () => {
  const absolute = useContext(Absolute);
  return (
    <BlueprintPage
      content={
        <Barchart
          url={`${absolute ? "https://retaily.site:7000" : ""}/inventaris/`}
        />
      }
    />
  );
};

export default InventoryBarchartPage;
