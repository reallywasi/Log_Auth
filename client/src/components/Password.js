import React from "react";
import { Link } from "react-router-dom";
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from "../helper/validate";


function Password() {
    
const formik=useFormik({
    initialValues:{
        password:''
    },
    validate :passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
        console.log(values)}
})


  return (
    <div className="container mx-auto">

    <Toaster position=" top-center" reverseOrder={false}></Toaster>
      <div className="flex  h-screen justify-center items-center">
        <div className="title flex flex-col items-center">
          <h4 className="text-5xl font-bold">Hello again</h4>
          <span className="py-4 text-xl w-2/3 text-center text-gray-500 ">
            Explore More by connect
          </span>
          <div>
            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img src={avatar} alt="avatar" className={styles.profile_img} />
              </div>
              <div className="textbox flex flex-col items-center py-4">
                <input {...formik.getFieldProps('password')}  type="password" placeholder="Password" className={styles.textbox}></input>
                <button type="submit" className={styles.btn}> Sign in</button>
                <div className="text-center py-4">
                  <span className="text-gray-500">
                    Forgor Password?{" "}
                    <Link className=" text-red-500" to="/recovery">
                      {" "}
                      Recover Now
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password;


