import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GoalCard from "../components/goal/GoalCard";

import "@testing-library/jest-dom";

describe("GoalCard component", () => {
  it("should render button component correctly", () => {
    const handleAddSavingClick = jest.fn();
    const handleViewDetailsClick = jest.fn();
    const { getByText } = render(
      <GoalCard
        name="Test Goal"
        amount={1000}
        max={2000}
        onAddSavingClick={handleAddSavingClick}
        onViewDetailsClick={handleViewDetailsClick}
      />
    );
    const addSavingButton = getByText("Add Saving");
    const viewDetailsButton = getByText("View Details");
    expect(addSavingButton).toBeInTheDocument();
    expect(viewDetailsButton).toBeInTheDocument();
    fireEvent.click(addSavingButton);
    expect(handleAddSavingClick).toHaveBeenCalled();
    fireEvent.click(viewDetailsButton);
    expect(handleViewDetailsClick).toHaveBeenCalled();
  });

  it("should render progress bar correctly", () => {
    const { getByText } = render(<GoalCard name="Test Goal" amount={1000} max={2000} />);
    const progressBar = getByText("50%");
    expect(progressBar).toBeInTheDocument();
  });
});
