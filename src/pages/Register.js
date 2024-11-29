import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import AppNavbar from "../components/AppNavbar";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      // Send a POST request to the API to register the user
      const response = await fetch(
        "https://fitnessapp-api-ln8u.onrender.com/users/register",
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
        throw new Error(result.message || "Registration failed.");
      }

      // Simulate login after successful registration
      const userData = { email }; // Replace with additional user data if needed
      login(userData);
      notyf.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      notyf.error(error.message || "Registration failed! Please try again.");
    }
  };

  return (
    <div>
      <AppNavbar />
      <div className="text-center">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
