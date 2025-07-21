import Heading from "../components/Heading";
import MainBody from "../components/MainBody";
import { resetPassword } from "../firebase/auth.ts";
import React, { useState } from 'react';
import { Link } from "react-router-dom";

function ForgotPassPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Check your email for password reset instructions.');
      setError('');
    } catch (error: any) {
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <div>
      <Heading name="All Cards" size={100} />
      <MainBody />

       <div
        className="p-4 shadow mx-auto w-50 my-5"
        style={{
          backgroundColor: "#F5F5F5",
          flexShrink: 0,
          borderRadius: "46px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  aria-label="Back"
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
              </Link>
              <h2 className="anta-regular text-dark text-center mx-auto fontsizing">
               Reset Password
              </h2>
            </div>
            <div
              className={"mx-auto bg-black my-4"}
              style={{ height: "2px" }}
            ></div>
            <div className="mb-1">
              {/*FORM STARTS HERE*/}
              <form onSubmit={handleSubmit} >
                
            
                
                <label className="anta-regular text-dark fs-5 form-label my-1">
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
                      backgroundColor: "#A3A9AA",
                      color: "Black",
                    }}
                  >Reset Password
                    
                  </button>
                </div>
              </form>
              {message && <div className="alert alert-success mt-3">{message}</div>}
             {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>

        
        </div>
    );
}

export default ForgotPassPage;