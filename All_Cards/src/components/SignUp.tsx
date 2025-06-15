import "../assets/css/font.css";
import "../assets/css/SignUp.css";

function SignUp() {
  return (
    <>
      <div className="bg-light rounded p-4 shadow mx-auto w-responsive mt-5 signup">
        <p className="pixelify-sans text-dark text-center fs-4">
          Register with Email & Password
        </p>
        <div
          className={"mx-auto bg-black my-4"}
          style={{ height: "2px" }}
        ></div>
        <div className="mb-1">
          <form>
            <label className="pixelify-sans text-dark fs-5 form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="first_Name"
              placeholder="First Name"
            />
            <label className="pixelify-sans text-dark fs-5 form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="last_Name"
              placeholder="Last Name"
            />
            <label className="pixelify-sans text-dark fs-5 form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
            />
            <label className="pixelify-sans text-dark fs-5 form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
            />
            <label className="pixelify-sans text-dark fs-5 form-label">
              Re-enter Password
            </label>
            <input
              type="password"
              className="form-control"
              id="rePassword"
              placeholder="Re-enter Password"
            />
            <div>
              <button
                type="button"
                className="pixelify-sans btn text-black btn btn-secondary p-2 w-100 d-flex mx-auto justify-content-center fs-5 mt-3"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
