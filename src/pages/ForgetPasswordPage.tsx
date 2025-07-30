import Header from "../components/Header";
import { resetPassword } from "../firebase/auth.ts";
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
      setMessage("");
    }
  };

  return (
    <div className="page-background">
      <Header />
      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "3px" }}
      ></div>

      <div className="glass-dark">
        <h3 className="cinzel-body highlight-header animate-delay-1 animate-in pulse">
          Your Binder. Your Realm. Built for Glory.
        </h3>
      </div>

      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "1px" }}
      ></div>

      <div
        className="container my-5 w-50 h-75 p-4 anta-accounts"
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
              <h2 className="text-center" style={{ fontSize: "2.25rem" }}>
                Remember Thy Archive
              </h2>
            </div>
            <div
              className={"mx-auto bg-white my-3"}
              style={{ height: "2px" }}
            ></div>
            <div className="mb-1">
              {/*FORM STARTS HERE*/}
              <form onSubmit={handleSubmit}>
                <div className="form-row mb-3">
                  <label htmlFor="email" className="anta-accounts">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="invalid-feedback d-block anta-regular">
                    Please enter a valid email address.
                  </div>
                )}
                <div>
                  <button type="submit" className="button-confirm w-100 py-0">
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
