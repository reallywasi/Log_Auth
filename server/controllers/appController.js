import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}













// /** POST: http://localhost:8080/api/register 
//  * @param : {
//   "username" : "example123",
//   "password" : "admin123",
//   "email": "example@gmail.com",
//   "firstName" : "bill",
//   "lastName": "william",
//   "mobile": 8009860560,
//   "address" : "Apt. 556, Kulas Light, Gwenborough",
//   "profile": ""
// }
// */

export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // Check for existing username
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        // Check for existing email
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ error: "Email Already in Use" });
        }

        // Hash the password
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            // Save the user
            await user.save();
            return res.status(201).send({ msg: "User registered successfully" });
        } else {
            return res.status(400).send({ error: "Password is required" });
        }
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).send({ error: "Server error", details: error.message });
    }
}








// /** POST: http://localhost:8080/api/login 
//  * @param: {
//   "username" : "example123",
//   "password" : "admin123"
// }
// */
// export async function login(req,res){
   
//     const { username, password } = req.body;

//     try {
        
//         UserModel.findOne({ username })
//             .then(user => {
//                 bcrypt.compare(password, user.password)
//                     .then(passwordCheck => {

//                         if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

//                         // create jwt token
//                         const token = jwt.sign({
//                                         userId: user._id,
//                                         username : user.username
//                                     }, env.JWT_SECRET , { expiresIn : "24h"});

//                         return res.status(200).send({
//                             msg: "Login Successful...!",
//                             username: user.username,
//                             token
//                         });                                    

//                     })
//                     .catch(error =>{
//                         return res.status(400).send({ error: "Password does not Match"})
//                     })
//             })
//             .catch( error => {
//                 return res.status(404).send({ error : "Username not Found"});
//             })

//     } catch (error) {
//         return res.status(500).send({ error});
//     }
// }
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not match" });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).send({
            msg: "Login Successful!",
            username: user.username,
            token
        });

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).send({ error: "Server error", details: error.message });
    }
}













// /** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    res.json('getUser route');
}


// /** PUT: http://localhost:8080/api/updateuser 
//  * @param: {
//   "id" : "<userid>"
// }
// body: {
//     firstName: '',
//     address : '',
//     profile : ''
// }
// */
export async function updateUser(req,res){
    res.json('updateUser route');
}


// /** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    res.json('generateOTP route');
}


// /** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    res.json('verifyOTP route');
}


// // successfully redirect user when OTP is valid
// /** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
    res.json('createResetSession route');
}


// // update the password when we have valid session
// /** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    res.json('resetPassword route');
}




// Add the missing controller for registerMail and authenticate
export async function registerMail(req, res) {
    res.status(201).json({ message: "User registered successfully" });
}

export async function authenticate(req, res) {
    res.status(201).json({ message: "User authenticated successfully" });
}
