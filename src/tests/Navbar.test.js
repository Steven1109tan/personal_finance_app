import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import "@testing-library/jest-dom";

describe("Navbar", () => {
  it("should display the correct navigation links", () => {
    const { getByText } = render(<Navbar />);
    expect(getByText("Expense")).toBeInTheDocument();
    expect(getByText("Budget")).toBeInTheDocument();
    expect(getByText("Saving Goal")).toBeInTheDocument();
    expect(getByText("Analytics")).toBeInTheDocument();
  });

  it("should toggle the responsive navigation when the hamburger menu is clicked", () => {
    const { getByTestId } = render(<Navbar />);
    const navbar = getByTestId("navbar");
    const hamburgerMenu = getByTestId("hamburger-menu");

    expect(navbar).not.toHaveClass("responsive_nav");
    fireEvent.click(hamburgerMenu);
    expect(navbar).toHaveClass("responsive_nav");
    fireEvent.click(hamburgerMenu);
    expect(navbar).not.toHaveClass("responsive_nav");
  });
});
