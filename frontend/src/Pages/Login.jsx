import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate,} from "react-router-dom";
import MessageModal from "../components/MessageModal";

function Login() {

  const [messageModal, setMessageModal] = useState({
      show: false,
      type: "info",
      title: "",
      message: "",
      redirectTo: null,
    });

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate();
    const location = useLocation();

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

    const redirectPath =
      location.state?.from || "/";

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
        showMessage(
          "error",
          "Login Failed",
          data.message || "Invalid email or password."
        );

        return;
      }
      
      login(data.user);

      localStorage.setItem(
        "token",
        data.token
      );
      
      showMessage(
        "success",
        "Login Successful",
        `Welcome back, ${data.user.name}!`,
        redirectPath
      );
      
      console.log("LOGGED IN USER:", data.user); 
      console.log("SAVED USER:", localStorage.getItem("user")); 

        } catch (error) {
          console.error("Login error:", error);
        
          showMessage(
            "error",
            "Login Error",
            "Something went wrong. Please try again."
          );
        }
    }
    return (
        <div className="addproduct-page">
          <div className="auth-card">
            <h1>Login</h1>
    
            <p>Login to continue shopping.</p>
    
            <form className="addproduct-form login" onSubmit={handleSubmit}>
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
    
              <p></p>
              <button className="addproduct-btn" type="submit">
                Login
              </button>
            </form>
    
            <p className="gapping-register">
              Don't have an account?{" "}
              <Link
                  className="addproduct-btn"
                  to="/register"
                  state={{
                    from: redirectPath,
                  }}
                >
                  Register
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
                  });
                }
              }}
            />
        </div>
      );
    }
    
    export default Login;