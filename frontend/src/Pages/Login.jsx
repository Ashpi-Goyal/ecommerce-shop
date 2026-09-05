import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    function handleChange(event) {
        const { name, value } = event.target;
    
        setFormData({
          ...formData,
          [name]: value,
        });
      }

      async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch(
              "http://localhost:5000/api/auth/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              }
            );

            const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        alert(data.message);
        return;
      }
      
      alert("Login successful!");
      
      login(data.user);
      localStorage.setItem("token", data.token);
      
      console.log("LOGGED IN USER:", data.user); 
      console.log("SAVED USER:", localStorage.getItem("user")); 

        } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
        }
    }
    return (
        <div className="auth-page">
          <div className="auth-card">
            <h1>Login</h1>
    
            <p>Login to continue shopping.</p>
    
            <form onSubmit={handleSubmit}>
              <label>Email</label>
    
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
    
              <label>Password</label>
    
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
    
              <button type="submit">
                Login
              </button>
            </form>
    
            <p>
              Don't have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      );
    }
    
    export default Login;