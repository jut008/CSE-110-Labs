import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Expense } from "../../types/types";
import { v4 as uuidv4 } from 'uuid';

const AddExpenseForm = () => {
  // Exercise: Consume the AppContext here
  const { expenses, setExpenses } = useContext(AppContext);
  // Exercise: Create name and cost to state variables
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newExpense: Expense = {
      id: uuidv4(),
      name: name,
      cost: cost,
    };
    if(newExpense.cost < 0){
      // alert("Please enter a non-negative cost");
      setCost(0);
      return;
    }
    else{
      // Exercise: Add add new expense to expenses context array
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      // reset the name and cost for next time
      setName("");
      setCost(0);
    }
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCost(+event.target.value);
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            data-testid="name-input"
            value={name}
            onChange={handleNameChange}
          ></input>
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="text"
            className="form-control"
            id="cost-input"
            data-testid="cost-input"
            value={cost}
            onChange={handleCostChange}
          ></input>
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3" data-testid="save-expense">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;
