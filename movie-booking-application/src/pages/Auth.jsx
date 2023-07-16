import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signIn } from "../api/auth";
import { AxiosInstance } from "../util/axiosInstance";

const Auth = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const initialLoginFormValues = {
    userId: "",
    password: "",
  };

  const initialSignupFormValues = {
    userId: "",
    password: "",
    email: "",
    username: "",
    userType: "CUSTOMER",
  };

  const [loginFormValues, setLoginFormValues] = useState(
    initialLoginFormValues
  );

  const [signupFormValues, setSignupFormValues] = useState(
    initialSignupFormValues
  );

  useEffect(() => {
    if (localStorage.getItem("token")) {
      switch (localStorage.getItem("userTypes")) {
        case "CUSTOMER":
          navigate("/customer");
          break;
        case "CLIENT":
          navigate("/client");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
      }
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const data = await signIn(
        loginFormValues.userId,
        loginFormValues.password
      );

      toast.success("Welcome to the app!");
      switch (data.userTypes) {
        case "CUSTOMER":
          navigate("/customer");
          break;
        case "CLIENT":
          navigate("/client");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
      }
    } catch (ex) {
      console.log(ex);
      if (ex.message === "APPROVAL PENDING") {
        toast.error("Admin is yet to approve your sign in request");
        return;
      }
      toast.error(ex.response.data.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await AxiosInstance.post("/mba/api/v1/auth/signup", {
        userId: signupFormValues.userId,
        password: signupFormValues.password,
        name: signupFormValues.username,
        email: signupFormValues.email,
        userType: signupFormValues.userType,
      });
      setShowSignup(false);
      toast.success("Signup done. Please login with your credentials!");
    } catch (ex) {
      setErrorMessage(ex.response.data.message);
    }
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const handleLoginFormChange = (event) =>
    setLoginFormValues({
      ...loginFormValues,
      [event.target.name]: event.target.value,
    });

  const handleSignupFormChange = (event) =>
    setSignupFormValues({
      ...signupFormValues,
      [event.target.name]: event.target.value,
    });

  return (
    <div id="loginPage">
      <div className="bg-danger d-flex justify-content-center align-items-center vh-100">
        <div className="card m-5 p-5">
          <div className="row m-2">
            <div className="col">
              {!showSignup && (
                <div>
                  <h4 className="text-center">Login</h4>
                  <form onSubmit={handleLogin}>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Id"
                        name="userId"
                        value={loginFormValues.userId}
                        onChange={handleLoginFormChange}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={loginFormValues.password}
                        onChange={handleLoginFormChange}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="submit"
                        className="form-control btn btn-danger"
                        value="Login"
                      />
                    </div>
                    <div
                      className="signup-btn text-right text-info"
                      style={{ cursor: "pointer" }}
                      onClick={toggleSignup}
                    >
                      Don't have an account? Signup
                    </div>
                    <div className="auth-error-msg text-danger text center">
                      {errorMessage}
                    </div>
                  </form>
                </div>
              )}
              {showSignup && (
                <div>
                  <h4 className="text-center">Signup</h4>
                  <form onSubmit={handleSignup}>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Id"
                        value={signupFormValues.userId}
                        name="userId"
                        onChange={handleSignupFormChange}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        name="username"
                        required
                        value={signupFormValues.username}
                        onChange={handleSignupFormChange}
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        required
                        value={signupFormValues.email}
                        onChange={handleSignupFormChange}
                      />
                    </div>
                    <div className="input-group m-1">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={signupFormValues.password}
                        onChange={handleSignupFormChange}
                        required
                      />
                    </div>
                    <div className="input-group m-1">
                      <Form.Select
                        aria-label="User Type Selection"
                        value={signupFormValues.userType}
                        onChange={handleSignupFormChange}
                        name="userType"
                      >
                        <option>User Type</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="CLIENT">CLIENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </Form.Select>
                    </div>

                    <div className="input-group m-1">
                      <input
                        type="submit"
                        className="form-control btn btn-danger"
                        value="Sign up"
                      />
                    </div>
                    <div
                      className="signup-btn text-center text-info"
                      style={{ cursor: "pointer" }}
                      onClick={toggleSignup}
                    >
                      Already have an account? Log in.
                    </div>
                    <div className="auth-error-msg text-danger text center">
                      {errorMessage}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
