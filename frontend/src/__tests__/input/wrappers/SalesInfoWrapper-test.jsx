import React from "react";
import { shallow } from "enzyme";
import SalesChartWrapper from "../../../components/input/wrappers/SalesInfoWrapper";

describe("shallow <SalesChartsWrapper />", () => {
  const salesChartWrapper = shallow(<SalesChartWrapper />);
  test("Retrieve on clicking retrieve button", () => {
    expect(salesChartWrapper.state("retrieve")).toEqual(false);

    salesChartWrapper.find("button.btn").simulate("click");

    /* We expect retrieve to be true, as the child objects aren't rendered in shallow
    In other words: onLoaded() is never called */
    expect(salesChartWrapper.state("retrieve")).toEqual(true);
  });
});
