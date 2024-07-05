import React, { useState } from 'react';
import axios from 'axios';
import style from './style.module.css';
import userIcon from "../Icons/user.png"
import emailIcon from "../Icons/email.png";
import passIcon from "../Icons/pass.png";
import eyeIcon from "../Icons/eye-sharp.png";
import eyecloseIcon from "../Icons/eye-off-sharp.png";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  toast( {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
    });
  const { fullName, email, password, confirmPassword } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('https://reguser.netlify.app/.netlify/functions/api/register', formData);
      console.log(res.data);
      toast.success('User registered successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error registering user');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    
    <form className={style.container} onSubmit={onSubmit}>
   
    <h1>Signup</h1>
    <div>
      <img className={style.inputIcons} src={userIcon} alt="" srcset="" />
      <input
        type="text"
        name="fullName"
        placeholder='Full Name'
        value={fullName}
        onChange={onChange}
        required
      />
    </div>
    <div>
    <img className={style.emailIcons} src={emailIcon} alt="Emailicon" srcset="" />
      <input
        type="email"
        name="email"
        placeholder='Email ID'
        value={email}
        onChange={onChange}
        required
      />
    </div>
    <div>
    <img className={style.passIcons} src={passIcon} alt="passwordIcon" srcset="" />
      <input
        type="password"
        name="password"
        placeholder='Create a Password'
        value={password}
        onChange={onChange}
        required
      />
    </div>
    <div>
      {showPassword?<><img className={style.eyeIcons}
      onClick={togglePasswordVisibility} 
      src={eyecloseIcon} 
      alt="passwordIcon" 
      srcset="" /></>:<><img className={style.eyeIcons}
      onClick={togglePasswordVisibility} 
      src={eyeIcon} 
      alt="passwordIcon" 
      srcset="" /></>}
      
      <input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder='Confirm Password'
        value={confirmPassword}
        onChange={onChange}
        required
      />
    </div>
    <button className={style.submitbtn} type="submit">Register</button>
    <p className={style.para} >Already have an Account? <span>Login</span></p>
  </form>
  <ToastContainer/>
  </>
  );
};

export default RegistrationForm;
