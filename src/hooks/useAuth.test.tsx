// AuthProvider.simple.test.tsx
import React from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "src/services/firebase";
import { AuthProvider, useAuth } from "./useAuth"
import { render } from "@testing-library/react";


jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock the Firebase service
jest.mock("src/services/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

describe("AuthProvider", () => {
  it("calls signIn when the signIn function is invoked", async () => {
    const mockUserCredential = { user: { email: "testuser@example.com", uid: "12345" } };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(mockUserCredential);

    const TestComponent = () => {
      const auth = useAuth();
      const handleSignIn = async () => {
        await auth.signIn("testuser@example.com", "password123");
      };

      React.useEffect(() => {
        handleSignIn(); // Automatically call signIn on mount
      }, []);

      return null; // Render nothing
    };

    render(
      <AuthProvider>
      </AuthProvider>
    );

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(firebase.auth, "testuser@example.com", "password123");
  });
});
