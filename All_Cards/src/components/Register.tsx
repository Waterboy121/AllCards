import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  MakeUser , getUserDisplayName } from "../firebase/auth.ts";
import "bootstrap-icons/font/bootstrap-icons.css";

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
      await MakeUser(data.email, data.password, data.display_name);
      console.log("Sign up Successful! Welcome " + getUserDisplayName() + "!");
      navigate("/homepage");
      throw new Error();
    } catch (error: any) {
      setError("repassword", { message: "Email is already in use" });
    }
  };

  return (
    <>
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
                Forge Thy Archive
              </h2>
              {/* Forge Thy Ledger */}
            </div>

            <div
              className={"mx-auto bg-white my-3"}
              style={{ height: "1.75px" }}
            ></div>
            <div className="mb-1">
              {/*FORM STARTS HERE*/}
              <form onSubmit={handleSubmit(onSignUpSubmit)}>
                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  User Name
                </label>
                <input
                  {...register("display_name")}
                  type="text"
                  className="form-control"
                  placeholder="ex: TheAllMaster"
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
                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="text"
                  className="form-control"
                  placeholder="ex: Lord-of-Allcards@master.com"
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
                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="form-control"
                  placeholder="ex: theAllMeister*3000"
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
                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  Re-enter Password
                </label>
                <input
                  {...register("repassword")}
                  type="password"
                  className="form-control"
                  placeholder=""
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
                      backgroundColor: "#222222ff",
                      color: "#f5f5f5",
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
