import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUser, LoginWithEP } from "../firebase/auth.ts";
import "../assets/css/font.css";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(40, "Password must not be more than 40 characters")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one Uppercase letter")
    .regex(/(?=.*\d)/, "Password must contain at least one digit")
    .regex(
      /((?=.*\W)|(?=.*_))/,
      "Password must contain at least one special character"
    )
    .regex(/^[^ ]+$/, "Password must not contain any spaces"),
});

type LoginFormFields = z.infer<typeof schema>;

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(schema),
  });

  const onLoginSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await LoginWithEP(data.email, data.password);
      console.log("Logged in Successful! Welcome " + getUser() + "!");
      navigate("/homepage");
      throw new Error();
    } catch (errors: any) {
      setError("password", { message: "Invalid Email or Password" });
    }
  };

  return (
    <>
      {/*  width: "555px", height: "460px" */}
      <div
        className="container my-5 w-50 h-75 p-4"
        style={{
          backgroundColor: "#F5F5F5",
          flexShrink: 0,
          borderRadius: "46px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="row justify-content-center ">
          <div className="col-md-10">
            <h2
              className="anta-regular text-center"
              style={{ fontSize: "28px", color: "black" }}
            >
              Log in with Email & Password
            </h2>
            <div
              className="mx-auto bg-black my-3"
              style={{ height: "2px" }}
            ></div>
            {/*Form Starts Here*/}
            <form onSubmit={handleSubmit(onLoginSubmit)}>
              <div className="mb-1">
                <label
                  className="form-label anta-regular"
                  style={{ fontSize: "24px" }}
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="text"
                  className="form-control"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="">
                <label
                  className="form-label anta-regular"
                  style={{ fontSize: "24px" }}
                >
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="form-control"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {errors.password && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.password.message}
                  </div>
                )}
                {errors.root && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.root.message}
                  </div>
                )}
              </div>
              {/*create a popup that opens it up instead of a whole new page*/}
              <Link
                to={"/forgot-password"}
                className="anta-regular mb-3"
                style={{ fontSize: "18px", color: "black" }}
              >
                Forgot Password?
              </Link>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn btn-dark anta-regular w-100 mt-2"
                style={{
                  fontSize: "20px",
                  backgroundColor: "#A3A9AA",
                  color: "Black",
                }}
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </form>
            <div
              className={"mx-auto bg-black mt-2"}
              style={{ height: "2px" }}
            ></div>
            <div>
              <p
                className="anta-regular text-center"
                style={{ fontSize: "18px", color: "black" }}
              >
                <Link to="/signup" style={{ color: "black" }}>
                  Dont have an account?
                </Link>
              </p>
              <Link to={"/signup"}>
                <button
                  type="submit"
                  className="btn btn-dark anta-regular w-100 mb-2"
                  style={{
                    fontSize: "20px",
                    backgroundColor: "#A3A9AA",
                    color: "Black",
                  }}
                >
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
