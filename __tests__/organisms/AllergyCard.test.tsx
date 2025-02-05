// import React from "react";
// import '@testing-library/jest-dom'; // Ensure jest-dom is imported for custom matchers
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import AllergiesCard from "../../src/components/organisms/AllergiesCard/AllergiesCard";
// import { Provider } from "react-redux";
// import store from "../../src/store/store";
// // import { fetchAllergies } from "../../../features/allergySlice/allergyThunk";




// // Mock the AllergyTable and TabListHeader components
// jest.mock("../../molecules/AllergyTable/AllergyTable", () => () => <div>Allergy Table</div>);
// jest.mock("../../molecules/TabListHeader/TabListHeader", () => ({ tabs, onTabClick }) => (
//   <div>
//     {tabs.map((tab) => (
//       <button key={tab.label} onClick={() => onTabClick(tab.label)}>{tab.label} ({tab.count})</button>
//     ))}
//   </div>
// ));

// describe("AllergiesCard", () => {
//   // Define mock allergy data with required properties
//   const mockAllergies = [
//     { id: "1", allergen: "Peanut", severity: "High", begdatets: "2023-01-01", type: "allergy" },
//     { id: "2", allergen: "Dust", severity: "Medium", begdatets: "2023-02-01", type: "allergy" },
//     { id: "3", allergen: "Milk", severity: "Low", begdatets: "2023-03-01", type: "other" },
//   ];

//   it("renders loading state correctly", () => {
//     // Render the component with loading state
//     render(
//       <Provider store={store}>
//         <AllergiesCard />
//       </Provider>
//     );

//     // Make sure loading text is displayed
//     expect(screen.getByText(/loading/i)).toBeInTheDocument();
//   });

//   it("renders error state correctly", async () => {
//     // Mock the useSelector to simulate error state
//     jest.spyOn(store, "getState").mockReturnValueOnce({
//       allergies: { allergies: [], loading: false, error: "An error occurred" },
//     });

//     render(
//       <Provider store={store}>
//         <AllergiesCard />
//       </Provider>
//     );

//     // Make sure error text is displayed
//     await waitFor(() => expect(screen.getByText(/error: an error occurred/i)).toBeInTheDocument());
//   });

//   it("renders tabs with correct labels and counts", async () => {
//     // Mock allergies data
//     jest.spyOn(store, "getState").mockReturnValueOnce({
//       allergies: { allergies: mockAllergies, loading: false, error: null },
//     });

//     render(
//       <Provider store={store}>
//         <AllergiesCard />
//       </Provider>
//     );

//     // Check if the tabs are rendered correctly with the right counts
//     expect(screen.getByText("Active (3)")).toBeInTheDocument();
//     expect(screen.getByText("Allergy (2)")).toBeInTheDocument();
//     expect(screen.getByText("Others (1)")).toBeInTheDocument();
//   });

//   it("changes active tab when a tab is clicked", async () => {
//     // Mock allergies data
//     jest.spyOn(store, "getState").mockReturnValueOnce({
//       allergies: { allergies: mockAllergies, loading: false, error: null },
//     });

//     render(
//       <Provider store={store}>
//         <AllergiesCard />
//       </Provider>
//     );

//     // Click on "Others" tab
//     fireEvent.click(screen.getByText("Others (1)"));

//     // Verify if the active tab is updated
//     expect(screen.getByText("Others (1)")).toHaveClass("active"); // Or check some active class
//   });

//   it("renders the AllergyTable component", () => {
//     // Mock allergies data
//     jest.spyOn(store, "getState").mockReturnValueOnce({
//       allergies: { allergies: mockAllergies, loading: false, error: null },
//     });

//     render(
//       <Provider store={store}>
//         <AllergiesCard />
//       </Provider>
//     );

//     // Verify if AllergyTable is rendered
//     expect(screen.getByText("Allergy Table")).toBeInTheDocument();
//   });
// });
