import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUser, MakeUser } from "../firebase/auth.ts";
import "../assets/css/font.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/css/SignUp.css";

const schema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(40, "Password must not be more than 40 characters")
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one Uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one digit")
      .regex(
        /((?=.*\W)|(?=.*_))/,
        "Password must contain at least one special character"
      )
      .regex(/^[^ ]+$/, "Password must not contain any spaces"),
    repassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(40, "Password must not be more than 40 characters")
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one Uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one digit")
      .regex(
        /((?=.*\W)|(?=.*_))/,
        "Password must contain at least one special character"
      )
      .regex(/^[^ ]+$/, "Password must not contain any spaces"),
    display_name: z
      .string()
      .min(1, "Your name must be at least one character long")
      .regex(
        /^[A-Z]/,
        "The first letter of your display name must be UpperCase"
      ),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords are not the same",
    path: ["repassword"],
  });

type SignUpFormFields = z.infer<typeof schema>;

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormFields>({ resolver: zodResolver(schema) });

  const onSignUpSubmit: SubmitHandler<SignUpFormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(data); //get rid of later
      MakeUser(data.email, data.password, data.display_name)
        .then(() => {
          console.log("Sign up Successful! Welcome " + getUser() + "!");
          navigate("/homepage");
        })
        .catch(() => {
          setError("root", { message: "Email already taken!" });
        });
      throw new Error();
    } catch (error) {
      setError("root", { message: "Email already taken" }); //make better error message
    }
  };

  return (
    <>
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
                Register with Email & Password
              </h2>
            </div>
            <div
              className={"mx-auto bg-black my-4"}
              style={{ height: "2px" }}
            ></div>
            <div className="mb-1">
              {/*FORM STARTS HERE*/}
              <form onSubmit={handleSubmit(onSignUpSubmit)}>
                <label className="anta-regular text-dark fs-5 form-label my-1">
                  Display Name
                </label>
                <input
                  {...register("display_name")}
                  type="text"
                  className="form-control"
                  placeholder="Display Name"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {errors.display_name && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.display_name.message}
                  </div>
                )}
                <label className="anta-regular text-dark fs-5 form-label my-1">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />{" "}
                {errors.email && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.email.message}
                  </div>
                )}
                <label className="anta-regular text-dark fs-5 form-label my-1">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />{" "}
                {errors.password && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.password.message}
                  </div>
                )}
                <label className="anta-regular text-dark fs-5 form-label my-1">
                  Re-enter Password
                </label>
                <input
                  {...register("repassword")}
                  type="password"
                  className="form-control"
                  placeholder="Re-enter Password"
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {errors.repassword && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.repassword.message}
                  </div>
                )}
                {errors.root && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.root.message}
                  </div>
                )}
                <div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-dark anta-regular w-100 mt-4"
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#A3A9AA",
                      color: "Black",
                    }}
                  >
                    {isSubmitting ? "Loading..." : "Register"}
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
