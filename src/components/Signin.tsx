import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUser, SigninWithEP } from "../firebase/auth.ts";

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

type SigninFormFields = z.infer<typeof schema>;

function Signin() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormFields>({
    resolver: zodResolver(schema),
  });

  const onSigninSubmit: SubmitHandler<SigninFormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await SigninWithEP(data.email, data.password);
      console.log("Signed in Successful! Welcome " + getUser() + "!");
      navigate("/homepage");
    } catch (error: unknown) {
      // Safely handle unknown errors with a type guard
      let message = "Invalid Email or Password";

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      setError("password", { message });
    }
  };

  return (
    <>
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
            <h2 className="text-center" style={{ fontSize: "2.25rem" }}>
              Unlock Thy Archive
            </h2>
            <div
              className="mx-auto bg-white my-3"
              style={{ height: "2px" }}
            ></div>

            <form onSubmit={handleSubmit(onSigninSubmit)}>
              <div className="form-row">
                <label htmlFor="email" className="anta-accounts">
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="text"
                  style={{ width: "100%" }}
                />
              </div>

              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email.message}
                </div>
              )}

              <div className="form-row">
                <label htmlFor="password" className="anta-accounts">
                  Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  style={{ width: "100%" }}
                />
              </div>

              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.message}
                </div>
              )}
              {errors.root && (
                <div className="invalid-feedback d-block">
                  {errors.root.message}
                </div>
              )}

              <Link
                to={"/forgot-password"}
                className="anta-accounts mb-3"
                style={{ fontSize: "1.125rem", color: "#c0c0c0" }}
              >
                Forgot Password?
              </Link>
              <button
                disabled={isSubmitting}
                type="submit"
                className="button-confirm w-100 mb-2"
              >
                {isSubmitting ? "Loading..." : "Signin"}
              </button>
            </form>
            <div
              className={"mx-auto bg-white mt-2"}
              style={{ height: "1.25px" }}
            ></div>
            <div>
              <p
                className="anta-accounts mb-3"
                style={{ fontSize: "1.125rem" }}
              >
                <Link to="/signup" style={{ color: "#c0c0c0" }}>
                  Dont have an account?
                </Link>
              </p>
              <Link to={"/signup"}>
                <button
                  type="submit"
                  className="button-cancel w-100 mb-2"
                  style={{ fontSize: "1.25rem" }}
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

export default Signin;
