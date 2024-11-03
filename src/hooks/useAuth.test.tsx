import { renderHook, act } from "@testing-library/react-hooks";
import { AuthProvider, useAuth } from "./useAuth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as updPassword,
  updateEmail as updEmail,
} from "firebase/auth";
import firebase from "src/services/firebase";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updatePassword: jest.fn(),
  updateEmail: jest.fn(),
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
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("Sign Up", () => {
    it("signs up a user successfully", async () => {
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

    describe("Sign Out", () => {
      it("signs out a user successfully", async () => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: AuthProvider,
        });

        await act(async () => {
          await result.current.signOut();
        });

        expect(firebaseSignOut).toHaveBeenCalled();
        expect(result.current.user).toBeNull();
      });

      it("handles sign out errors gracefully", async () => {
        const mockError = {
          code: "auth/no-current-user",
          message: "No current user",
        };
        (firebaseSignOut as jest.Mock).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useAuth(), {
          wrapper: AuthProvider,
        });

        await act(async () => {
          await result.current.signOut();
        });

        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining(`CODE: ${mockError.code}`)
        );
        expect(result.current.user).toBeNull();
      });
    });

    describe("Update Password", () => {
      it("updates the user's password successfully", async () => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: AuthProvider,
        });

        await act(async () => {
          await result.current.updatePassword("newPassword");
        });

        expect(updPassword).toHaveBeenCalledWith(
          firebase.auth.currentUser,
          "newPassword"
        );
      });
    });

    describe("Update Email", () => {
      it("updates the user's email successfully", async () => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: AuthProvider,
        });

        await act(async () => {
          await result.current.updateEmail("new@example.com");
        });

        expect(updEmail).toHaveBeenCalledWith(
          firebase.auth.currentUser,
          "new@example.com"
        );
      });
    });

    describe.each([
      {
        method: "signUp",
        args: ["test@example.com", "password"],
        error: {
          code: "auth/email-already-in-use",
          message: "Email already in use",
        },
      },
      {
        method: "signIn",
        args: ["user@example.com", "password"],
        error: { code: "auth/wrong-password", message: "Wrong password" },
      },
      {
        method: "signOut",
        args: [],
        error: { code: "auth/no-current-user", message: "No current user" },
      },
    ])("Error Handling for $method", ({ method, args, error }) => {
      it(`logs the correct error message for ${method}`, async () => {
        const mockedMethod = {
          signUp: createUserWithEmailAndPassword,
          signIn: signInWithEmailAndPassword,
          signOut: firebaseSignOut,
        }[method] as jest.Mock;

        mockedMethod.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useAuth(), {
          wrapper: AuthProvider,
        });

        await act(async () => {
          await (result.current as any)[method](...args);
        });

        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining(`CODE: ${error.code}`)
        );
      });
    });
  });
});
