import User from "../models/userModel.js";

const getUsersForSideBar = async (req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const allUsers = await User.find({ _id: {$ne : loggedInUser}}).select("-password")

        res.status(200).json(allUsers);

    } catch (error) {
        console.log("Error getting users : ",error.message)
        res.status(500).json({error : "Internal server error"})
    }
}

export {getUsersForSideBar}