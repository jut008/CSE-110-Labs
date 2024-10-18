import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToDoList } from "./toDoList";
import { dummyGroceryList } from "./constant";

// ;-;
describe("To Do List Component", () => {
    //testing if all items are displayed
    test("displays all items in the list", () => {
        render(
            <MemoryRouter initialEntries={["/todo/Judy"]}>
                <Routes>
                    <Route path="/todo/:name" element={<ToDoList />} />
                </Routes>
            </MemoryRouter>
        );

        //checks that each item from dummyGroceryList is displayed
        dummyGroceryList.forEach((item) => {
            const checkbox = screen.getByRole("checkbox", { name: item.name });
            expect(checkbox).toBeInTheDocument();
        });
    });
    //tests that all checkboxes are correctly marked based on initial data
    test("correct checkboxes are checked based on initial data", () => {
        render(
            <MemoryRouter initialEntries={['/todo/Judy']}>
                <Routes>
                    <Route path="/todo/:name" element={<ToDoList />} />
                </Routes>
            </MemoryRouter>
        );
      
        //loop through the dummyGroceryList to check if the items are rendered correctly
        dummyGroceryList.forEach(item => {
            const checkbox = screen.getByRole('checkbox', { name: item.name });
            if (item.isPurchased) {
                expect(checkbox).toBeChecked();
            } else {
                expect(checkbox).not.toBeChecked();
            }
        });
    });

    //test if the number of items checked is shown in the title
    test("checks if the number of items checked matches the number shown in the title", () => {
        render(
            <MemoryRouter initialEntries={["/todo/Judy"]}>
                <Routes>
                    <Route path="/todo/:name" element={<ToDoList />} />
                </Routes>
            </MemoryRouter>
        );

        const checkboxes = screen.getAllByRole("checkbox");

        //no items should be checked initially
        const itemsBoughtText = screen.getByText(/Items bought: 0/i);
        expect(itemsBoughtText).toBeInTheDocument();

        //click on two checkboxes
        fireEvent.click(checkboxes[0]);
        fireEvent.click(checkboxes[1]);

        //bought items should be 2
        const updatedItemsBoughtText = screen.getByText(/Items bought: 2/i);
        expect(updatedItemsBoughtText).toBeInTheDocument();
    });
});