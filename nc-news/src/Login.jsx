import { useState, useRef, useEffect } from "react";
import "../CSS/Login.css";

function LoginForm({ isLoggedIn, setIsLoggedIn, username, setUsername }) {
  const [showForm, setShowForm] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target) &&
        !buttonClicked
      ) {
        setShowForm(false);
      }
      setButtonClicked(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonClicked]);

  const handleButtonClick = () => {
    setShowForm(!showForm);
    setButtonClicked(!buttonClicked);
    setErrorMessage("");
    setMessage("");
    setIsLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const user = await authenticateUser(username.toLowerCase());
      if (user) {
        localStorage.setItem("username", username);
        setErrorMessage("");
        setSuccess(true);
        setMessage("Login Successful!");
        setAvatar(`${user.avatar_url}`);
        setName(user.name);
        setTimeout(() => {
          setIsLoggedIn(true);
          setShowForm(false);
          setMessage("");
          setIsLoading(false);
          setSuccess(false);
        }, 2000);
      } else {
        setMessage("");
        setErrorMessage("Login failed!");
      }
    } catch (error) {
      if (error.message === "Invalid Login Details") {
        setErrorMessage("");
        setMessage("");
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowForm(false);
    localStorage.removeItem("username");
    setUsername("");
    setIsLoggedIn(false);
    setIsLoggingOut(false);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <div className="login-btn-container">
        <button className="sign-in" onClick={handleButtonClick}>
          {isLoggedIn ? username : showForm ? "Cancel" : "Sign in"}
        </button>

        {showForm && !isLoggedIn ? (
          <form
            className={`login-form ${showForm ? "visible" : ""}`}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <label>
              User:
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                name="username"
                placeholder="Enter Username..."
                required
              />
            </label>
            {message && <div className="success-message">{message}</div>}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <div className="spinner-container">
              {isLoading ? (
                <div className="loading-animation"></div>
              ) : success ? (
                <div className="loading-animation"></div>
              ) : (
                <button className="login-button" type="submit">
                  Log in
                </button>
              )}
            </div>
          </form>
        ) : (
          isLoggedIn && (
            <form
              className={`login-form ${showForm ? "visible" : ""}`}
              ref={formRef}
            >
              <div className="spinner-container">
                {isLoggingOut ? (
                  <div className="loading-animation"></div>
                ) : (
                  <button className="sign-out" onClick={handleLogout}>
                    Sign Out
                  </button>
                )}
              </div>
            </form>
          )
        )}
      </div>
    </>
  );
}

export default LoginForm;

async function authenticateUser(username) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${username}`
  );

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid Login Details");
    } else {
      throw new Error(`Failed to log in: ${response.status}`);
    }
  }

  const data = await response.json();
  console.log(data.user);

  if (data.user) {
    return { username, name: data.user.name, avatar_url: data.user.avatar_url };
  } else {
    throw new Error("Invalid Login Details");
  }
}
