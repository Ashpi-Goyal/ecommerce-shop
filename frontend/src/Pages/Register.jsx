import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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
      
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
      
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
              }),
            }
          );
      
          const data = await response.json();
      
          if (!response.ok) {
            alert(data.message);
            return;
          }
      
          alert("Registration successful!");
      
          //console.log("REGISTERED USER:", data);
          //alert(data.message);
      
        } catch (error) {
          console.error("Registration error:", error);
          alert("Something went wrong. Please try again.");
        }
      }

      return (
        <div className="auth-page">
          <div className="auth-card">
            <h1>Create Account</h1>
    
            <p>Register to continue shopping.</p>
    
            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
    
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
    
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
                placeholder="Enter password"
                required
              />
    
              <label>Confirm Password</label>
    
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
    
              <button type="submit">
                Register
              </button>
            </form>
    
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      );
    
}

export default Register;