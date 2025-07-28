import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from "../firebase/index"; // adjust this path as needed
import { UpdateUserProfile } from "../firebase/auth"; // your helper function


// Schema for form validation
const schema = z.object({
  displayName: z.string()
      .min(1, "Your name must be at least one character long")
      .regex(
        /^[A-Z]/,
        "The first letter of your display name must be UpperCase"
      ),
  email: z.string().email('Invalid email address'),
  newPassword: z
     .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')), // allow empty string
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
        displayName: data.displayName || undefined,
        email: data.email || undefined,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword || undefined,

      });

      setSuccess('Profile updated successfully!');
      reset({ ...data, newPassword: '', currentPassword: '' }); // clear password field
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };





  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2>Update Profile</h2>


      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        <div className="mb-3">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className={`form-control ${errors.displayName ? 'is-invalid' : ''}`}
            {...register('displayName')}
          />
          {errors.displayName && (
            <div className="invalid-feedback">{errors.displayName.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">New Password (optional)</label>
          <input
            type="password"
            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <div className="invalid-feedback">{errors.newPassword.message}</div>
          )}
        </div>

         <div className="mb-3">
          <label className="form-label">Current Password (optional)</label>
          <input
            type="password"
            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
            {...register('currentPassword')}
          />
          {errors.currentPassword && (
            <div className="invalid-feedback">{errors.currentPassword.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {success && <div className="alert alert-success mt-3">{success}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default UpdateProfile;