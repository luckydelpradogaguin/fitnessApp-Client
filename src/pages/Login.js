import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import AppNavbar from "../components/AppNavbar";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const response = await fetch(
        "https://fitnessapp-api-ln8u.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      login(result.user || { email });
      notyf.success("Login successful!");
      navigate("/workouts"); // Redirecting to /workouts
    } catch (error) {
      console.error("Login Error:", error.message);
      notyf.error(error.message || "Login failed! Please try again.");
    }
  };

  return (
    <div>
      <AppNavbar />
      <div className="text-center">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
