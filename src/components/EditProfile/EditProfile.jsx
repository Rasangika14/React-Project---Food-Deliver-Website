// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './EditProfile.css';

// const EditProfile = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const storedUser = localStorage.getItem('user');
//         if (!storedUser) {
//           navigate('/login');
//           return;
//         }

//         const response = await fetch('http://localhost:8081/api/users/profile', {
//           headers: {
//             'Authorization': `Bearer ${JSON.parse(storedUser).token}`,
//           },
//         });

//         const data = await response.json();
//         if (!response.ok) {
//           throw new Error(data.error || 'Failed to fetch profile');
//         }

//         setFormData({
//           name: data.user.name,
//           email: data.user.email,
//         });
//       } catch (err) {
//         setApiError(err.message);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: '',
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email is invalid';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError('');

//     if (validateForm()) {
//       setIsSubmitting(true);

//       try {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         const response = await fetch('http://localhost:8081/api/users/profile', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${storedUser.token}`,
//           },
//           body: JSON.stringify({
//             name: formData.name,
//             email: formData.email,
//           }),
//         });

//         const data = await response.json();
//         if (!response.ok) {
//           throw new Error(data.error || 'Failed to update profile');
//         }

//         localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data.user }));
//         alert('Profile updated successfully!');
//         navigate('/profile');
//       } catch (error) {
//         setApiError(error.message);
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   return (
//     <div className="edit-profile-container bg-gray-100 min-h-screen flex items-center justify-center">
//       <div className="edit-profile-card bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
//         {apiError && <div className="api-error text-red-500 mb-4">{apiError}</div>}
//         <form onSubmit={handleSubmit} className="edit-profile-form space-y-4">
//           <div className="form-group">
//             <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
//               placeholder="Enter your full name"
//             />
//             {errors.name && <span className="error-message text-red-500 text-sm">{errors.name}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
//               placeholder="Enter your email"
//             />
//             {errors.email && <span className="error-message text-red-500 text-sm">{errors.email}</span>}
//           </div>

//           <div className="form-actions flex space-x-4">
//             <button
//               type="submit"
//               className="save-btn w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded disabled:opacity-50"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               type="button"
//               className="cancel-btn w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
//               onClick={() => navigate('/profile')}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;