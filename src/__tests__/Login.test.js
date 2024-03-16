import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../pages/Login";
import { UserAuth } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
jest.mock("../context/AuthContext", () => ({
  UserAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // import and retain the original functionalities
  useNavigate: jest.fn(),
}));

jest.mock("../components/store/mainStore", () => ({
  __esModule: true, // mock the module to be an ES module
  default: jest.fn(() => ({
    setActivePage: jest.fn(),
  })),
}));

describe("Login Component", () => {
  const mockSignIn = jest.fn();
  const mockSendResetEmail = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    UserAuth.mockImplementation(() => ({
      signIn: mockSignIn,
      sendResetEmail: mockSendResetEmail,
    }));

    // Mock the navigate function
    require("react-router-dom").useNavigate.mockImplementation(
      () => mockNavigate
    );
  });

  test("renders Login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows user to enter email and password", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    expect(screen.getByLabelText(/email/i)).toHaveValue("user@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password");
  });

  test("handles form submission and navigates on successful login", async () => {
    mockSignIn.mockResolvedValueOnce(); // Simulate successful sign in

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockSignIn).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/houses"));
  });

  test("displays error on failed login", async () => {
    const errorMessage = "Invalid email or password";
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage)); // Simulate failed sign in

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockSignIn).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    );
  });
});
