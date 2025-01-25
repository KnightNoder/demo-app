describe("AddTodo Component", () => {
  beforeEach(() => {
    // Visit the page containing the AddTodo component
    cy.visit("http://localhost:3000"); // Replace with the correct URL for your app
  });

  it("should render input field and submit button", () => {
    cy.get("input[placeholder='Add a task']").should("exist");
    cy.get("button[type='submit']").should("contain", "Add");
  });

  it("should allow typing into the input field", () => {
    const task = "Learn Cypress";
    cy.get("input[placeholder='Add a task']")
      .type(task)
      .should("have.value", task);
  });

  it("should clear input after submitting a valid task", () => {
    const task = "Write Cypress Tests";
    cy.get("input[placeholder='Add a task']").type(task);
    cy.get("button[type='submit']").click();
    cy.get("input[placeholder='Add a task']").should("have.value", "");
  });

  it("should not submit when the input is empty", () => {
    cy.get("button[type='submit']").click();
    cy.get("input[placeholder='Add a task']").should("have.value", "");
  });
});
