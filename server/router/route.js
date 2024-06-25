// // to create endpoints post get put


import express from "express";
const router = express.Router();
import Auth from "../middleware/auth.js";

//import all the controllers
import * as controller from '../controllers/appController.js'

// -------- POST METHODS --------
router.post("/register", controller.register);
router.post("/registerMail", controller.registerMail);
router.post("/authenticate", controller.authenticate);
router.post("/login",controller.verifyUser, controller.login);

// -------- GET METHODS --------
router.get('/user/:username', controller.getUser);
router.get('/generateOTP', controller.generateOTP);
router.get('/verifyOTP', controller.verifyOTP);
router.get('/createResetSession', controller.createResetSession);

// -------- PUT METHODS --------
router.put('/updateuser',Auth, controller.updateUser);
router.put('/resetPassword', controller.resetPassword);





export default router;






