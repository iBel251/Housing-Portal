jest.mock("../../context/AdminContext", () => ({
  AdminAuth: () => ({
    fetchAllUsers: jest.fn(),
    fetchAdminData: jest.fn(),
  }),
}));

jest.mock("../../components/store/mainStore", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setAllUsers: jest.fn(),
    setAdminData: jest.fn(),
    setActiveLink: jest.fn(),
  })),
}));

// Mock child components
jest.mock("./Header", () => () => <div>Header Mock</div>);
jest.mock("./Sidebar", () => () => <div>Sidebar Mock</div>);

import React from "react";
import { render, waitFor } from "@testing-library/react";
import Admin from "./Admin";
import { AdminAuth } from "../../context/AdminContext";
import useMainStore from "../../components/store/mainStore";

// Setup mock return values
AdminAuth.mockImplementation(() => ({
  fetchAllUsers: jest.fn(() => Promise.resolve([{ id: 1, name: "User 1" }])),
  fetchAdminData: jest.fn(() => Promise.resolve({ data: "Some admin data" })),
}));

useMainStore.mockImplementation(() => ({
  setAllUsers: jest.fn(),
  setAdminData: jest.fn(),
  setActiveLink: jest.fn(),
}));

describe("Admin Component", () => {
  it("renders and fetches data correctly", async () => {
    const { getByText } = render(<Admin />);

    await waitFor(() => {
      expect(AdminAuth().fetchAllUsers).toHaveBeenCalled();
      expect(AdminAuth().fetchAdminData).toHaveBeenCalled();

      // Verify that the child components are rendered
      expect(getByText("Header Mock")).toBeInTheDocument();
      expect(getByText("Sidebar Mock")).toBeInTheDocument();
    });
  });
});
