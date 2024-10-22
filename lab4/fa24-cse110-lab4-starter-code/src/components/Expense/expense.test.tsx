import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { AppContext } from "../../context/AppContext";
import AddExpenseForm from "./AddExpenseForm";
import App from "../../App";
import { Expense } from "../../types/types";
import { MyBudgetTracker } from "../../views/MyBudgetTracker";

describe("Add Expenses", () => {
  let expenses: Expense[] = [];
  
  const mockSetExpenses = jest.fn((newExpensesOrCallback) => {
    if (typeof newExpensesOrCallback === 'function') {
      expenses = newExpensesOrCallback(expenses);
    } else {
      expenses = newExpensesOrCallback;
    }
  });

  const BUDGET_START = 1000;

  const renderApp = () => {
    return render(
      <AppContext.Provider 
        value={{ 
          expenses, 
          setExpenses: mockSetExpenses, 
          budget: BUDGET_START 
        }}
      >
        <MyBudgetTracker />
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    expenses = [];
    mockSetExpenses.mockClear();
  });

  beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test("Check that components exist", () => {
    renderApp();
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("cost-input")).toBeInTheDocument();
    expect(screen.getByTestId("save-expense")).toBeInTheDocument();
  });

  test("Check default values", () => {
    renderApp();
    expect(screen.getByTestId("name-input")).toHaveValue("");
    expect(screen.getByTestId("cost-input")).toHaveValue("0");
  });

  test("Add a new expense of cost 50", async () => {
    const { rerender } = renderApp();

    // Input values
    await act(async () => {
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { value: "Groceries" },
      });
      fireEvent.change(screen.getByTestId("cost-input"), {
        target: { value: "50" },
      });

      // Submit form
      fireEvent.click(screen.getByTestId("save-expense"));
    });

    // Wait for state to update
    await waitFor(() => {
      expect(mockSetExpenses).toHaveBeenCalled();
    });
    // Check that the expense list was updated
    const updatedExpenses = mockSetExpenses.mock.calls[0][0]([]);
    expect(updatedExpenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Expense>({
          id: expect.any(String),
          name: "Groceries",
          cost: 50
        }),
      ])
    )
    // Check that defaults were reset
    expect(screen.getByTestId("name-input")).toHaveValue("");
    expect(screen.getByTestId("cost-input")).toHaveValue("0");

    // Force rerender with updated expenses
    rerender(
      <AppContext.Provider 
        value={{ 
          expenses: updatedExpenses, 
          setExpenses: mockSetExpenses, 
          budget: BUDGET_START 
        }}
      >
        <MyBudgetTracker />
      </AppContext.Provider>
    );

    // Check the remaining value
    expect(screen.getByTestId("remaining")).toHaveTextContent(`Remaining: $${BUDGET_START - 50}`);
  });
  test("Add a new expense of cost 1001", async () => {
    const { rerender } = renderApp();
    const cost = 1001;

    // Input values
    await act(async () => {
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { value: "Very expensive whole foods groceries" },
      });
      fireEvent.change(screen.getByTestId("cost-input"), {
        target: { value: cost },
      });

      // Submit form
      fireEvent.click(screen.getByTestId("save-expense"));
    });

    // Wait for state to update
    await waitFor(() => {
      expect(mockSetExpenses).toHaveBeenCalled();
    });
    // Check that the expense list was updated
    const updatedExpenses = mockSetExpenses.mock.calls[0][0]([]);
    expect(updatedExpenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Expense>({
          id: expect.any(String),
          name: "Very expensive whole foods groceries",
          cost: cost
        }),
      ])
    )
    // Check that defaults were reset
    expect(screen.getByTestId("name-input")).toHaveValue("");
    expect(screen.getByTestId("cost-input")).toHaveValue("0");

    // Force rerender with updated expenses
    rerender(
      <AppContext.Provider 
        value={{ 
          expenses: updatedExpenses, 
          setExpenses: mockSetExpenses, 
          budget: BUDGET_START 
        }}
      >
        <MyBudgetTracker />
      </AppContext.Provider>
    );
    // Check if alert was called
    expect(window.alert).toHaveBeenCalled();

    // Check the remaining value
    expect(screen.getByTestId("remaining")).toHaveTextContent(`Remaining: $${BUDGET_START - cost}`);
  });
});