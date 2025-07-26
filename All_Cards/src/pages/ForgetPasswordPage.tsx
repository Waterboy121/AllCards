import Header from "../components/Header";
import { resetPassword } from "../firebase/auth.ts";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/RegisterPage.css"; //reuse the register page css

function ForgotPassPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await resetPassword(email);
      setMessage("Check your email for password reset instructions.");
      setError("");
    } catch (error: any) {
      setError(error.message);
      setMessage("");
    }
  };

  return (
    <div className="page-background">
      <Header name="All Cards" size={100} />
      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "3px" }}
      ></div>

      <div className="header-bg">
        <h3 className="cinzel-body text-center mt-4 pt-2 royal-header animate-in animate-delay-1 pulse">
          Your Binder. Your Realm. Built for Glory.
        </h3>
      </div>

      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "1px" }}
      ></div>

      <div
        className="container my-5 w-50 h-75 p-4"
        style={{
          backgroundColor: "#353839",
          flexShrink: 0,
          borderRadius: "46px",
          boxShadow: "0 0 12px #c0c0c0",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="position-relative text-center mb-4">
              <Link to="/">
                <button
                  type="button"
                  className="btn btn-outline-secondary position-absolute top-50 start-0 translate-middle-y"
                  aria-label="Back"
                >
                  <i
                    className="bi bi-arrow-left"
                    style={{ color: "#f5f5f5" }}
                  ></i>
                </button>
              </Link>
              <h2
                className="anta-regular"
                style={{ fontSize: "36px", color: "#f5f5f5", margin: 0 }}
              >
                Remember Thy Archive
              </h2>
            </div>
            <div
              className={"mx-auto bg-white my-3"}
              style={{ height: "1.75px" }}
            ></div>
            <div className="mb-1">
              {/*FORM STARTS HERE*/}
              <form onSubmit={handleSubmit}>
                <label
                  className="form-label anta-regular"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />

                {error && (
                  <div className="invalid-feedback d-block anta-regular">
                    Please enter a valid email address.
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    className="btn btn-dark anta-regular w-100 mt-4"
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#222222ff",
                      color: "#f5f5f5",
                    }}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
              {message && (
                <div className="alert alert-success mt-3">{message}</div>
              )}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassPage;
