import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { User } from "../../../../Server/src/models/user";
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
      const user = await User.findOne({ username });
      if (!user) {
        setError("User not found.");
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      login(user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}{" "}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogInPage;
