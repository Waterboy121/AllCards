import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from "../firebase/index"; // adjust this path as needed
import { UpdateUserProfile, updatePass } from "../firebase/auth"; // your helper function
import "bootstrap-icons/font/bootstrap-icons.css";


// Schema for form validation
const schema = z.object({
  displayName: z.string()
      .min(1, "Your name must be at least one character long")
      .regex(
        /^[A-Z]/,
        "The first letter of your display name must be UpperCase"
      ),
  email: z.string().email('Invalid email address'),
 
  currentPassword: z
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
      
});


const passwordSchema = z.object({
  newPassword: z.string()
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
  currentPassword: z.string()
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
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type FormValues = z.infer<typeof schema>;

function UpdateProfile() {
  const user = auth.currentUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      currentPassword: '', // not used in this form
     
    },
  });

  const {
  register: registerPassword,
  handleSubmit: handleSubmitPassword,
  formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  reset: resetPassword,
} = useForm<PasswordFormValues>({
  resolver: zodResolver(passwordSchema),
  defaultValues: {
    currentPassword: '',
    newPassword: '',
  },
});

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: FormValues) => {
    setSuccess('');
    setError('');

    try {

      await UpdateUserProfile({
        displayName: data.displayName || '',
        email: data.email || '',
        currentPassword: data.currentPassword || undefined,
      

      });

      setSuccess('Profile updated successfully!');
      reset({ ...data, currentPassword: '' }); // clear password field
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };




const updatePassword = async (data: PasswordFormValues) => {
    setSuccess('');
    setError('');

    try {

      
      await updatePass(data.currentPassword, data.newPassword);
      setSuccess('Profile updated successfully!');
      resetPassword({ ...data, newPassword: '', currentPassword: '' }); // clear password field
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }

};



  return (
    <>
    
    <div
        className="container w-50 mt-4  p-4"
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
              <Link to="/homepage">
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
                Reforge Thy Archive
              </h2>
            </div>

            <div
              className={"mx-auto bg-white my-3"}
              style={{ height: "1.75px" }}
            ></div>
            <div className="mb-1">
              
              {/* Display Name and Email Update Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  Display Name
                </label>
                <input
                  {...register("displayName")}
                  type="text"
                  className={`form-control ${errors.displayName ? 'is-invalid' : ''}`}
                  
                 
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
               {errors.displayName && (
            <div className="invalid-feedback d-block anta-regular">{errors.displayName.message}</div>
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
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  
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
                  Current Password
                </label>
                <input
                  {...register("currentPassword")}
                  type="password"
                  className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {errors.currentPassword && (
                  <div className="invalid-feedback d-block anta-regular">
                    {errors.currentPassword.message}
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
                    className="btn btn-dark anta-regular w-100 mt-3 mb-4"
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#222222ff",
                      color: "#f5f5f5",
                    }}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>



              {/* Password Update Form */}
              <form onSubmit={handleSubmitPassword(updatePassword)}>


                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                 New Password 
                </label>
                <input
                  {...registerPassword("newPassword")}
                  type="password"
                  className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {passwordErrors.newPassword && (
                  <div className="invalid-feedback d-block anta-regular">
                    {passwordErrors.newPassword.message}
                  </div>
                )}
                <label
                  className="anta-regular form-label my-1"
                  style={{ fontSize: "24px", color: "#f5f5f5" }}
                >
                  Current Password
                </label>
                <input
                  {...registerPassword("currentPassword")}
                  type="password"
                  className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderWidth: "1px",
                    borderColor: "#000",
                  }}
                />
                {passwordErrors.currentPassword && (
                  <div className="invalid-feedback d-block anta-regular">
                    {passwordErrors.currentPassword.message}
                  </div>
                )}
                {passwordErrors.root && (
                  <div className="invalid-feedback d-block anta-regular">
                    {passwordErrors.root.message}
                  </div>
                )}
                <div>
                  <button
                    disabled={isSubmittingPassword }
                    type="submit"
                    className="btn btn-dark anta-regular w-100 mt-3"
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#222222ff",
                      color: "#f5f5f5",
                    }}
                  >
                    {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
              {success && <div className="alert alert-success mt-3">{success}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;