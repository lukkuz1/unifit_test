// src/hooks/useAuth.test.tsx
import { renderHook, act } from "@testing-library/react-hooks";
import { AuthProvider, useAuth } from "./useAuth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("src/services/firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  },
}));

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should sign up a user", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
    const mockUserCredential = { user: mockUser };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
      mockUserCredential
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      const response = await result.current.signUp(
        "test@example.com",
        "password"
      );
      expect(response).toEqual(mockUserCredential);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it("should sign out a user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
  });

  it("handles sign out errors gracefully", async () => {
    const mockError = new Error("auth/no-current-user");
    (firebaseSignOut as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
  });
});
