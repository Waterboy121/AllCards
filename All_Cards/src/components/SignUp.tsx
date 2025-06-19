import "../assets/css/font.css";
import Heading from "./Heading";


function SignUp() {
  return (
    <>
      <Heading name="All Cards" size={100} />
      {/* 
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h1 className="pixelify-sans text-center" style={{ fontSize: "100px" }}>
          Sign Up
        </h1>
      </div> */}
    {/* <div className="bg-light rounded p-4 shadow mx-auto w-50 mt-5" style={{ backgroundColor: "#F5F5F5", flexShrink: 0, borderRadius:"46px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}> 
    className="pixelify-sans btn text-black btn btn-secondary p-2 w-100 d-flex mx-auto justify-content-center fs-5 mt-3"
              >*/ }
      <div className="p-4 shadow mx-auto w-50 my-5" style={{ backgroundColor: "#F5F5F5", flexShrink: 0, borderRadius:"46px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}> 
      <div className="row justify-content-center">
      <div className="col-md-10">
        <h2 className="anta-regular text-dark text-center" style={{ fontSize: "28px"}}>
          Register with Email & Password
        </h2>
        <div
          className={"mx-auto bg-black my-4"}
          style={{ height: "2px" }}
        ></div>
        <div className="mb-1">
          <form>
            <label className="anta-regular text-dark fs-5 form-label my-1">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="first_Name"
              placeholder="First Name"
              style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}}
            />
            <label className="anta-regular text-dark fs-5 form-label my-1">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="last_Name"
              placeholder="Last Name"
              style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}}
            />
            <label className="anta-regular text-dark fs-5 form-label my-1">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}}
            />
            <label className="anta-regular text-dark fs-5 form-label my-1">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}}
            />
            <label className="anta-regular text-dark fs-5 form-label my-1">
              Re-enter Password
            </label>
            <input
              type="password"
              className="form-control"
              id="rePassword"
              placeholder="Re-enter Password"
              style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}}
            />
            <div>
              <button
                type="button"
                
                className="btn btn-dark pixelify-sans w-100 mt-4" style={{fontSize: "20px", backgroundColor: "#A3A9AA", color:"Black"}}>
                Register
              </button>
            </div>
          </form>
        </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
