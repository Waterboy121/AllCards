import "../assets/css/font.css";
import MainBody from "./MainBody";
import { Link } from "react-router-dom";

function Login() {
    return(
        <>
        <MainBody />
        {/*  width: "555px", height: "460px" */}
    <div className="container my-5 w-50 h-75 p-4" style={{ backgroundColor: "#F5F5F5", flexShrink: 0, borderRadius:"46px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <div className="row justify-content-center ">
                <div className="col-md-10">
                    <h2 className="anta-regular text-center" style={{ fontSize: "28px", color: "black" }}>Log in with Email & Password</h2>
                    <div className="mx-auto bg-black my-3" style={{ height: "2px" }}></div>
                    <form>
                        <div className="mb-1">
                            <label htmlFor="username" className="form-label anta-regular" style={{fontSize: "24px"}}>Email</label>
                            <input type="text" className="form-control" style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}} id="username" />
                        </div>
                        <div className="">
                            <label htmlFor="password" className="form-label anta-regular" style={{fontSize: "24px"}}>Password</label>
                            <input type="password" className="form-control" style={{backgroundColor: "#F8F8FF", borderWidth: "1px", borderColor: "#000"}} id="password" />
                        </div>
                        <Link to={"/forgot-password"} className="anta-regular mb-3" style={{fontSize: "18px", color: "black"}}>Forgot Password?</Link>{/*add forgot password page later */}
                        <button type="submit" className="btn btn-dark pixelify-sans w-100 mt-2" style={{fontSize: "20px", backgroundColor: "#A3A9AA", color:"Black"}} >Login</button>
                    </form>
                    <div className={"mx-auto bg-black mt-2"} style={{ height: "2px" }}></div>
                    <div>
                    <p className="anta-regular text-center" style={{fontSize: "18px", color: "black"}}><u>Dont have an account?</u></p>
                    <Link to={"/signup"}>
                    <button type="submit" className="btn btn-dark pixelify-sans w-100 mb-2" style={{fontSize: "20px", backgroundColor: "#A3A9AA", color:"Black"}}>Register</button>
                    </Link>
                    </div>
                </div>
                
            </div>
        </div>
        </>
    );
    
        
    

}

export default Login;
