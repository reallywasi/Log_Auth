import React from "react";
import { Link } from "react-router-dom";
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from "../helper/validate";


function Recovery() {
    
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
          <h4 className="text-5xl font-bold">Recovery</h4>
          <span className="py-4 text-xl w-2/3 text-center text-gray-500 ">
Enter OTP to recover
          </span>
          <div>
            <form className="pt-20" >
             
              <div className="textbox flex flex-col items-center py-4">
               <div className="input text-center">
               <span className="py-4 text-sm text-left text-gray-500">Enter 6 digit OTP sent to your email address</span>
               <input   type="password" placeholder="OTP" className={styles.textbox}></input>
               </div>
               
               
              
                <button type="submit" className={styles.btn}> Sign in</button>
                <div className="text-center py-4">
                  <span className="text-gray-500">
                    Can't get OTP{" "}
                    <button className=" text-red-500">
                      {" "}
Resend
                    </button>
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

export default Recovery;


