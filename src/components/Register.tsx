import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUser, MakeUser } from "../firebase/auth.ts";
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
      console.log("Sign up Successful! Welcome " + getUser() + "!");
      navigate("/homepage");
    } catch (error: unknown) {
      let message = "Email is already in use";

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      setError("repassword", { message });
    }
  };

  return (
    <>
      <div
        className="container my-5 w-50 h-75 p-4 anta-accounts"
        style={{
          backgroundColor: "#353839",
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
                className="anta-accounts"
                style={{ fontSize: "2.25rem", margin: 0 }}
              >
                Forge Thy Ledger
              </h2>
            </div>

            <div
              className={"mx-auto bg-white my-3"}
              style={{ height: "1.75px" }}
            ></div>

            <form onSubmit={handleSubmit(onSignUpSubmit)}>
              <div className="form-row mb-3">
                <label htmlFor="display_name" className="anta-accounts">
                  User Name
                </label>
                <input
                  {...register("display_name")}
                  id="display_name"
                  type="text"
                  style={{ width: "100%" }}
                  placeholder="ex: TheAllMaster"
                />
              </div>

              {errors.display_name && (
                <div className="invalid-feedback d-block">
                  {errors.display_name.message}
                </div>
              )}

              <div className="form-row mb-3">
                <label htmlFor="email" className="anta-accounts">
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="text"
                  style={{ width: "100%" }}
                  placeholder="ex: Lord-of-Allcards@master.com"
                />
              </div>

              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email.message}
                </div>
              )}

              <div className="form-row mb-3">
                <label htmlFor="password" className="anta-accounts">
                  Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  style={{ width: "100%" }}
                  placeholder="ex: theAllMeister*3000"
                />
              </div>

              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.message}
                </div>
              )}

              <div className="form-row mb-4">
                <label htmlFor="repassword" className="anta-accounts">
                  Re-enter Password
                </label>
                <input
                  {...register("repassword")}
                  id="repassword"
                  type="password"
                  style={{ width: "100%" }}
                />
              </div>

              {errors.repassword && (
                <div className="invalid-feedback d-block">
                  {errors.repassword.message}
                </div>
              )}

              {errors.root && (
                <div className="invalid-feedback d-block">
                  {errors.root.message}
                </div>
              )}

              <div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="button-confirm w-100 mb-2"
                >
                  {isSubmitting ? "Loading..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
