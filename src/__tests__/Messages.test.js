import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Messages from "../pages/Messages";
import { UserAuth } from "../context/AuthContext";
import { ChatAuth } from "../context/ChatContext";
import useMainStore from "../components/store/mainStore";

jest.mock("../context/AuthContext", () => ({
  UserAuth: jest.fn(),
}));

jest.mock("../context/ChatContext", () => ({
  ChatAuth: jest.fn(),
}));

jest.mock("../components/store/mainStore", () => jest.fn());

describe("Messages Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("displays notification counts correctly", async () => {
    UserAuth.mockImplementation(() => ({
      user: { uid: "123" }, // Simulate an authenticated user
    }));

    ChatAuth.mockImplementation(() => ({
      getAllUserMessages: jest.fn().mockResolvedValue([]), // Mock fetching messages
    }));

    useMainStore.mockImplementation((selector) => {
      if (selector.name === "notifications") {
        return [
          { type: "message", chatRoomId: "1", status: "unseen" },
          { type: "message", chatRoomId: "2", status: "unseen" },
          { type: "enrollment", status: "unseen" },
        ]; // Simulate notifications state
      }
      if (selector.name === "activeChatRoomId") {
        return "1"; // Simulate an active chat room ID
      }
      if (selector.name === "setActivePage") {
        return jest.fn(); // Mock setActivePage action
      }
      return jest.fn();
    });

    render(
      <Router>
        <Messages />
      </Router>
    );

    // Verify that the badge for messages displays '1' (excluding the active chat room)
    expect(screen.getByText("Messages").parentNode).toHaveTextContent("1");
    // Verify that the badge for enrollments displays '1'
    expect(screen.getByText("Requests").parentNode).toHaveTextContent("1");
  });
});
