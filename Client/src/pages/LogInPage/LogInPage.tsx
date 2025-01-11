import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const LogInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found.");
        } else if (response.status === 401) {
          setError("Incorrect password.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      const data = await response.json();
      login(data.user);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-dark-green to-light-green text-white w-full h-screen space-y-8 font-primaryRegular">
      <div className="text-center mb-10 w-full">
        <h1 className="text-4xl font-primaryBold">Log In</h1>
        <p className="mt-4">Please log in to continue.</p>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-light-wheat text-dark-green p-8 rounded-xl shadow-lg w-11/12 sm:w-1/3"
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-lg">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-lg">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-8 py-3 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
        >
          Log In
        </button>
      </form>

      {/* <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-light-brown cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div> */}
    </div>
  );
};

export default LogInPage;
