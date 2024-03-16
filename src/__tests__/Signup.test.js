import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Signup from "../Signup";
import { UserAuth } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Mock UserAuth and useNavigate
jest.mock("../context/AuthContext", () => ({
  UserAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: jest.fn(),
}));

describe("Signup Component", () => {
  const mockCreateUser = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    UserAuth.mockImplementation(() => ({
      createUser: mockCreateUser,
    }));

    require("react-router-dom").useNavigate.mockImplementation(
      () => mockNavigate
    );
  });

  test("renders signup form correctly", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Check for form fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  test("handles form submission with correct data", async () => {
    mockCreateUser.mockResolvedValueOnce(); // Simulate successful signup

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() => expect(mockCreateUser).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/houses"));
  });

  test("shows error for password mismatch", async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Simulate user input with mismatched passwords
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password1" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password2" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() =>
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    );
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});
