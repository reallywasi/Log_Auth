import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator'


//__________________________________________________________________________________________________________
//==========================================================================================================

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




//__________________________________________________________________________________________________________
//==========================================================================================================







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




////__________________________________________________________________________________________________________
//==========================================================================================================



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





////__________________________________________________________________________________________________________
//==========================================================================================================


// /** GET: http://localhost:8080/api/user/example123 */
/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;

    console.log("Received request for username:", username);

    try {
        if (!username) {
            console.log("Invalid Username");
            return res.status(400).send({ error: "Invalid Username" });
        }

        console.log("Searching for user:", username);

        const user = await UserModel.findOne({ username: new RegExp('^' + username + '$', 'i') });
        if (!user) {
            console.log("User not found:", username);
            return res.status(404).send({ error: "Couldn't Find the User" });
        }

        console.log("User found:", user);

        // Remove password from user
        const { password, ...rest } = user.toJSON();

        return res.status(200).send(rest);
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).send({ error: "Cannot Find User Data", details: error.message });
    }
}

////__________________________________________________________________________________________________________
//==========================================================================================================

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



// export async function updateUser(req, res) {
//     try {
//         const userId = req.query.id;

//         if (!userId) {
//             return res.status(400).send({ error: "User ID is required" });
//         }

//         const updateFields = { ...req.body };

//         console.log("Updating user with ID:", userId);
//         console.log("Update fields:", updateFields);

//         const updatedUser = await UserModel.findByIdAndUpdate(userId, updateFields, { new: true });

//         console.log("Updated user:", updatedUser);

//         if (!updatedUser) {
//             return res.status(404).send({ error: "User not found or no changes made" });
//         }

//         return res.status(200).send({ msg: "User updated successfully", updatedUser });

//     } catch (error) {
//         console.error("Server error:", error);
//         return res.status(500).send({ error: "Server error", details: error.message });
//     }
// }


export async function updateUser(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).send({ error: "User Not Found!" });
        }

        const body = req.body;

        // Update the data
        const updatedUser = await UserModel.updateOne({ _id: userId }, body).exec();

        if (updatedUser.nModified === 0) {
            return res.status(404).send({ error: "User not found or no changes made" });
        }

        return res.status(201).send({ msg: "Record Updated...!" });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).send({ error: "Server error", details: error.message });
    }
}


////__________________________________________________________________________________________________________
//==========================================================================================================



// /** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


//__________________________________________________________________________________________________________
//==========================================================================================================


// /** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


//__________________________________________________________________________________________________________
//==========================================================================================================


// // successfully redirect user when OTP is valid
// /** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    req.app.locals.resetSession = true; // Start the reset session
    return res.status(201).send({ msg: 'Reset session created successfully' });
}


//__________________________________________________________________________________________________________
//==========================================================================================================



// // update the password when we have valid session
// /** PUT: http://localhost:8080/api/resetPassword */


export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ error: "Session expired!" });
        }

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ error: "Username and password are required" });
        }

        try {
            const user = await UserModel.findOne({ username });
            if (!user) {
                return res.status(404).send({ error: "Username not found" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const updateResult = await UserModel.updateOne({ username: user.username }, { password: hashedPassword });
            if (updateResult.nModified === 0) {
                return res.status(404).send({ error: "Failed to update password" });
            }

            req.app.locals.resetSession = false; // reset session
            return res.status(201).send({ msg: "Password updated successfully" });

        } catch (error) {
            console.error("Server error:", error);
            return res.status(500).send({ error: "Server error", details: error.message });
        }

    } catch (error) {
        return res.status(401).send({ error: "Unauthorized", details: error.message });
    }
}





//__________________________________________________________________________________________________________
//==========================================================================================================


// Add the missing controller for registerMail and authenticate
export async function registerMail(req, res) {
    res.status(201).json({ message: "User registered successfully" });
}


//__________________________________________________________________________________________________________
//==========================================================================================================

export async function authenticate(req, res) {
    res.status(201).json({ message: "User authenticated successfully" });
}


//__________________________________________________________________________________________________________
//==========================================================================================================