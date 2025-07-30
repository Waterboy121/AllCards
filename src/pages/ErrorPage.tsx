import { Link } from "react-router-dom";
import Header from "../components/Header";
import Awkward from "../assets/images/gifs/awkward.gif";

function ErrorPage() {
  return (
    <>
      <div className="page-background">
        <Header />
        <h1
          className="cinzel-body fw-bold text-danger"
          style={{ fontSize: "35px" }}
        >
          Page Not Found
        </h1>
        <p className="cinzel-body fw-bold lh-base" style={{ fontSize: "25px" }}>
          The page you are looking for doesn't exist or has changed or something
          went wrong
        </p>
        <img src={Awkward} className="img-fluid img-thumbnail mb-2"></img>
        <Link to={"/"}>
          <button className="btn btn-dark">Go Back to Login Page</button>
        </Link>
        <Link to={"/homepage"}>
          <button className="mt-2 btn btn-light">
            Go Back to Homepage Page
          </button>
        </Link>
      </div>
    </>
  );
}

export default ErrorPage;
