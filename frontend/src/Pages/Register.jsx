import { useState } from "react";
import { Link, useLocation, useNavigate, } from "react-router-dom";
import MessageModal from "../components/MessageModal";

function Register() {
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    redirectTo: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    location.state?.from || "/";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    function showMessage(
      type,
      title,
      message,
      redirectTo = null
    ) {
      setMessageModal({
        show: true,
        type,
        title,
        message,
        redirectTo,
      });
    }

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
          showMessage(
            "error",
            "Registration Failed",
            "Passwords do not match."
          );
      
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
            showMessage(
              "error",
              "Registration Failed",
              data.message || "Unable to create account."
            );
      
            return;
          }
      
          showMessage(
            "success",
            "Registration Successful",
            "Your account has been created successfully.",
            "/login"
          );
        } catch (error) {
          console.error("Registration error:", error);
      
          showMessage(
            "error",
            "Registration Error",
            "Something went wrong. Please try again."
          );
        }
      }

      return (
        <div className="addproduct-page">
          <div className="auth-card">
            <h1>Create Account</h1>
    
            <p>Register to continue shopping.</p>
    
            <form className="addproduct-form login" onSubmit={handleSubmit}>
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
    
              <button className="addproduct-btn" type="submit">
                Register
              </button>
            </form>
    
            <p>
              Already have an account?{" "}
              <Link to="/login" state={{ from: redirectPath,}}>
                Login
              </Link>
            </p>
          </div>

          <MessageModal
              show={messageModal.show}
              type={messageModal.type}
              title={messageModal.title}
              message={messageModal.message}
              onClose={() => {
                const redirectTo = messageModal.redirectTo;

                setMessageModal({
                  show: false,
                  type: "info",
                  title: "",
                  message: "",
                  redirectTo: null,
                });

                if (redirectTo) {
                  navigate(redirectTo, {
                    replace: true,
                    state: {
                      from: redirectPath,
                    },
                  });
                }
              }}
            />
        </div>
      );
    
}

export default Register;