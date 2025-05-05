import React, { useState } from 'react';
import { signup, login, loginWithGoogle, forgotPassword } from '../authService';
import Style from './AuthModal.module.css';  // Importing the CSS module
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AuthModal = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|google\.com|github\.com|outlook\.com)$/;
    if (!regex.test(email)) {
      setEmailError('Please enter a valid email from the allowed domains.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch (err) {
      toast.error("Incorrect ID or Password", {
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
    finally {
      setLoading(false); // Stop loading whether success or error
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.info("Please enter your email", {
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      })
      return;
    }
    await forgotPassword(email);
    alert('Password reset link sent to your email');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={ Style.overlay }>
      <div className={ Style.modal }>
        <h2 className={ Style.title }>{ isLogin ? 'Login' : 'Sign Up' }</h2>
        <form onSubmit={ handleSubmit } className={ Style.form }>
          { !isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={ name }
              onChange={ (e) => setName(e.target.value) }
              className={ Style.input }
              required
            />
          ) }
          <input
            type="email"
            placeholder="Email"
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
            className={ Style.input }
            required
          />
          { emailError && <p style={ { color: 'red', fontSize: '12px', } }>{ emailError }</p> }
          <div className={ Style.eye }>
            <input
              type={ showPassword ? 'text' : 'password' }
              placeholder="Password"
              value={ password }
              onChange={ (e) => setPassword(e.target.value) }
              className={ Style.input }
              required
            />
            <button
              type="button"
              onClick={ togglePasswordVisibility }
              className={ Style.toggleButton }  >
              <img style={ { height: '20px' } } src="/assets/images/eye-password.svg" alt="" />
            </button>
          </div>
          { isLogin && (
            <h2 onClick={ handleForgotPassword } className={ Style.forgotPassword }>
              Forgot Password?
            </h2>
          ) }
          <button type="submit" className={ Style.button } disabled={ loading }>
            { loading ? (
              <>
                { isLogin ? "Logging in..." : "Signing up..." }
                <span className={ Style.loader }></span>
              </>
            ) : (
              isLogin ? "Login" : "Sign Up"
            ) }
          </button>
          {/* <button type="submit" className={ Style.button }>
            { isLogin ? 'Login' : 'Sign Up' }
          </button> */}
        </form>
        <button onClick={ handleGoogleLogin } className={ Style.googleButton }>
          <img src="/assets/images/google_icon.png" alt="" />
          <span>Continue with Google</span>
        </button>

        <div className={ Style.switch }>
          { isLogin ? 'Don\'t have an account?' : 'Already have an account?' }{ ' ' }
          <button onClick={ () => setIsLogin(!isLogin) } className={ Style.switchButton }>
            { isLogin ? 'Sign Up' : 'Login' }
          </button>
        </div>
      </div>
      <ToastContainer limit={ 4 } />
    </div >
  );
};

export default AuthModal;

// import React, { useState } from "react";
// import { auth, db } from "./firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const getDeviceType = () => {
//     const userAgent = navigator.userAgent;
//     if (/Mobi|Android/i.test(userAgent)) {
//       return "mobile";
//     }
//     return "web";
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );
//       const user = userCredential.user;
//       await setDoc(doc(db, "users", user.uid), {
//         username: formData.username,
//         email: formData.email,
//         userType: getDeviceType(),
//         createdAt: new Date(),
//       });
//       alert("User created successfully!");
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       {" "}
//       <input
//         type="text"
//         name="username"
//         placeholder="Username"
//         value={formData.username}
//         onChange={handleChange}
//         required
//       />{" "}
//       <br />{" "}
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={handleChange}
//         required
//       />{" "}
//       <br />{" "}
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={handleChange}
//         required
//       />{" "}
//       <br /> <button type="submit">Sign Up</button>{" "}
//     </form>
//   );
// };
// export default SignUp;
