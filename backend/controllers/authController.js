import User from "../models/userModel.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signUp = async (req,res)=>{
    try {
        
        const {fullName , userName , password , confirmPassword , gender} = req.body;

        if(password!=confirmPassword){
            return res.status(400).json({error : "Passwords don't match"})
        };

        const user = await User.findOne({userName});

        if(user){
            return res.status(400).json({error: "Username already taken"})
        };

        //hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            fullName,
            userName,
            password : hashedPassword,
            gender,
            profilePic : gender=== "male"? boyProfilePic : girlProfilePic
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName :newUser.fullName,
            userName:newUser.userName,
            profilePic:newUser.profilePic
        });
        } else {
            res.status(400).json({error : "Invalid user data"})
        }

    } catch (error) {
        console.log("error signing up : " , error.message)
        res.status(400).json({error : "Internal server error" })
    }    
};
const login = async (req,res)=>{
    try {
        const {userName , password} = req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "") ;
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error : "Invalid credentials"})
        };

        generateTokenAndSetCookie(user._id,res);

        res.status(201).json({
            _id:user._id,
            fullName :user.fullName,
            userName:user.userName,
            profilePic:user.profilePic
        });
        
    } catch (error) {
        console.log("error login : " , error.message)
        res.status(400).json({error : "Internal server error" })
    }
};
const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{ maxAge : 0})
        res.status(200).json({message : "logged out successfully"});

    } catch (error) {
        console.log("error logout : " , error.message)
        res.status(400).json({error : "Internal server error" })
    }
};

export {signUp,login,logout}