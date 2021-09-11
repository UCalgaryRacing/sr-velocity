import React from "react";
import { shallow } from "enzyme";
import TopNavigation from "./topNavigation";

describe("top navigation", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<TopNavigation />);
  });

  describe("signed in", () => {
    it("page buttons exist", () => {});
    it("page buttons exist while signed in", () => {});
  });

  describe("signed out", () => {
    it("can sign in", () => {});
    it("page buttons do not exist", () => {});
  });
});
