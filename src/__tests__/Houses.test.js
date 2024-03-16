import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Houses from "../pages/Houses";
import { UserAuth } from "../context/AuthContext";
import useMainStore from "../components/store/mainStore";

// Mocking the context and store
jest.mock("../context/AuthContext", () => ({
  UserAuth: jest.fn(),
}));

jest.mock("../components/store/mainStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockLogout = jest.fn();

// Mocking the housedata
const mockAllHouses = [
  {
    id: "C2jSnIm2CVW1HZjAWge2",
    pic1: "https://firebasestorage.googleapis.com/v0/b/yegna-housing.appspot.com/o/images%2Fe25279cd-bcf0-4db0-893d-e320cce067c1?alt=media&token=f30b443a-6881-4ae3-8f29-603a173ec6c7",
    area: "hgfhfg",
    phone: "0912131419",
    peopleNeeded: 0,
    rooms: 8,
    areaSize: 150,
    price: 23000000,
    type: "sale",
    owner: "user 1",
    pic2: "https://firebasestorage.googleapis.com/v0/b/yegna-housing.appspot.com/o/images%2Fc6326639-d243-413e-ac3e-ce29bc607e2a?alt=media&token=82dd1a6b-1c06-40bc-b99d-61a2213b8a04",
    userId: "n2wqZb6kzWXuO97cFXlsFwdxawE2",
    subcity: "kirkos",
    location: {
      lat: 8.9915392,
      lng: 38.74816,
    },
    pic3: "https://firebasestorage.googleapis.com/v0/b/yegna-housing.appspot.com/o/images%2Fca8d9f8d-3b12-45fc-b5a6-c28872db57d3?alt=media&token=252d7009-a8b0-4fdb-abbc-6621499db77e",
    bathroom: "",
    detail: "thgfh",
    timestamp: {
      seconds: 1708755981,
      nanoseconds: 651000000,
    },
  },
];

const mockSetActivePage = jest.fn();

// Setup function to configure mocks for each test
const setupMocks = ({ emailVerified = true }) => {
  UserAuth.mockImplementation(() => ({
    user: { emailVerified: emailVerified },
    logout: mockLogout,
  }));

  useMainStore.mockImplementation((callback) => {
    if (callback.name === "allHouses") return mockAllHouses;
    if (callback.name === "setActivePage") return mockSetActivePage;
    return jest.fn();
  });
};

describe("Houses Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("shows loading initially and then displays houses", async () => {
    setupMocks({ emailVerified: true });

    render(<Houses />);

    // Verify that the loading text is displayed initially
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Verify that the houses are displayed after loading
    mockAllHouses.forEach((house) => {
      expect(screen.getByText(house.title)).toBeInTheDocument();
    });
  });

  test("verifies email not verified message when user email is not verified", async () => {
    // Setup with a user whose email is not verified
    setupMocks({ emailVerified: false });

    render(<Houses />);

    await waitFor(() => {
      expect(screen.queryByText("email not verified")).toBeInTheDocument();
    });
  });

  test("displays house details after loading", async () => {
    setupMocks({ emailVerified: true });

    render(<Houses />);

    // Wait for the loading indicator to disappear
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );

    // Check for the presence of house details
    expect(screen.getByText("hgfhfg")).toBeInTheDocument();
    expect(screen.getByText(/23000000/)).toBeInTheDocument();
  });
});
