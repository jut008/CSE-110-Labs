import { render, screen, fireEvent } from "@testing-library/react";
import { StickyNotes } from "./stickyNotes";

describe("Create StickyNotes", () => { //test suite 2
    
    test("renders create note form", () => {
        render(<StickyNotes />);

        const createNoteButton = screen.getByText("Create Note");
        expect(createNoteButton).toBeInTheDocument();
    });

    test("creates a new note", () => { 
        render(<StickyNotes />);

        //defining all the selections/options/buttons
        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea = screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");
    
        //changing title and content for 1st note
        fireEvent.change(createNoteTitleInput, { target: { value: "first note" } });
        fireEvent.change(createNoteContentTextarea, {
            target: { value: "first note content" },
        });
        //create first note
        fireEvent.click(createNoteButton);

        //creating second note
        fireEvent.change(createNoteTitleInput, { target: { value: "second note" } });
        fireEvent.change(createNoteContentTextarea, {
            target: { value: "second note content" },
        });
        fireEvent.click(createNoteButton);

        //screen.getByText looks for this text in the test rendered component(s)
        const firstNoteTitle = screen.getByText("first note");
        const firstNoteContent = screen.getByText("first note content");
        const secondNoteTitle = screen.getByText("second note");
        const secondNoteContent = screen.getByText("second note content");

        //testers verifying that they exist in the virtual DOM (testing zone)
        //the virtual DOM is a temporary version of the real DOM, used to handle changes before applying to the real DOM
        expect(firstNoteTitle).toBeInTheDocument();
        expect(firstNoteContent).toBeInTheDocument();
        expect(secondNoteTitle).toBeInTheDocument();
        expect(secondNoteContent).toBeInTheDocument();
    });
    
    //another tester yippe
    test("updates the note content when modified", () => {
        render(<StickyNotes />);
        //defining text sections/buttons
        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea = screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");

        fireEvent.change(createNoteTitleInput, { target: { value: "editable title" } });
        fireEvent.change(createNoteContentTextarea, { target: { value: "editable content" } });
        fireEvent.click(createNoteButton);

        //assign data-testid to the note's content for easier access
        const editableNoteContent = screen.getByText("editable content");
        editableNoteContent.setAttribute("data-testid", "note-content");

        //verify that the content is initially correct
        expect(editableNoteContent.innerHTML).toBe("editable content");

        //update the note's content by changing its innerHTML
        fireEvent.input(editableNoteContent, { target: { innerHTML: "updated content" } });

        //check if the note content has updated in the DOM
        expect(editableNoteContent.innerHTML).toBe("updated content");
    });

    //checks if a note has been deleted
    test("deletes a note when the delete button is clicked", () => {
        render(<StickyNotes />);

        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea = screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");

        fireEvent.change(createNoteTitleInput, { target: { value: "note to delete" } });
        fireEvent.change(createNoteContentTextarea, { target: { value: "this note will be deleted" } });
        fireEvent.click(createNoteButton);

        //check that the note is created and displayed
        const noteTitle = screen.getByText("note to delete");
        const noteContent = screen.getByText("this note will be deleted");
        expect(noteTitle).toBeInTheDocument();
        expect(noteContent).toBeInTheDocument();

        //find the delete button on the specific note and click it
        //newly created note has the id '-1'
        const deleteButton = screen.getByTestId(`delete-note--1`);
        fireEvent.click(deleteButton);

        //check that the note is no longer in the document
        expect(noteTitle).not.toBeInTheDocument();
        expect(noteContent).not.toBeInTheDocument();
    });

    //tests that you can not input or edit a title to have more than 50 characters
    test("should restrict the title input to 50 characters", () => {
        render(<StickyNotes />);
      
        //create a note
        const createNoteTitleInput = screen.getByPlaceholderText("Note Title") as HTMLInputElement;
        const createNoteContentTextarea = screen.getByPlaceholderText("Note Content") as HTMLTextAreaElement;
        const createNoteButton = screen.getByText("Create Note");
      
        //define the maximum character limit for the title
        const maxTitleChars = 50;
      
        //generate a title longer than the allowed limit
        const longTitle = "a".repeat(maxTitleChars + 1); // Exceeds the 50 character limit
        const validContent = "random";
      
        //input the long title into the title field
        fireEvent.change(createNoteTitleInput, { target: { value: longTitle } });
        fireEvent.change(createNoteContentTextarea, { target: { value: validContent } });
        
        //create the note
        fireEvent.click(createNoteButton);
      
        //title should be restricted to 50 characters in the input field
        expect(createNoteTitleInput.value.length).toBeLessThanOrEqual(maxTitleChars);
      
        //check the newly created note's title in the DOM to ensure it's first 50 characters
        const shortTitle = screen.getByText("a".repeat(maxTitleChars));
        expect(shortTitle).toBeInTheDocument();
    });
});