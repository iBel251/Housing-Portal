import { signOut } from "../services/firebase";
import { AuthContextProvider } from "../context/AuthContext";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../services/firebase";

describe("logout", () => {
  beforeEach(() => {
    signOut.mockClear();
  });

  it("successfully logs out the user", async () => {
    signOut.mockResolvedValue();

    // Similar setup as the createUser test
    const { logout } = setupTest();

    await logout();

    expect(signOut).toHaveBeenCalledWith(
      expect.anything() // The Firebase auth object
    );
  });
});

describe("createUser", () => {
  // Set up mock implementations
  beforeEach(() => {
    createUserWithEmailAndPassword.mockClear();
    sendEmailVerification.mockClear();
  });

  it("successfully creates a user", async () => {
    // Mock implementations
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123", email: "test@example.com" },
    });
    sendEmailVerification.mockResolvedValue();

    const { createUser } = setupTest();

    await createUser(
      "test@example.com",
      "password123",
      "John",
      "Doe",
      "https://example.com/pic.jpg"
    );

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    );
    expect(sendEmailVerification).toHaveBeenCalled();
  });
});
