import User from "../model/User.model.js";
import dotenv from "dotenv"
dotenv.config()
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
}

export const GenerteAcesstokenandRefresshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw Error("User not found")
        }
        const aceessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { aceessToken, refreshToken }
    } catch (error) {
        console.error("Error generating tokens:", error)
        throw Error("Token generation failed")

    }
}
export const registerUser = async (req, res) => {
    let { username, email, password, image = "",role,phone } = req.body
    if (!username || !email || !password || !phone) {
        return res.status(400).json({ message: "all fileds are required", success: false })
    }
    if(!role){
        role="user"
    }
    //find if any existing user here
    try {
        const alreadyexisst = await User.findOne({ email })
        if (alreadyexisst) {
            return res.status(404).json({ "message": "user already exist please login" })
        }
        const user = await User.create({ username, email, password, image,role,phone })

        const tokens = await GenerteAcesstokenandRefresshToken(user._id)
        //set cokiees
        res.cookie("aceessToken", tokens.aceessToken, cookieOptions)
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions)

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            phone:phone,
            profilepic: user.image,
            role:user.role
        }
        res.status(201).json({ "message": "user succesfully register", userResponse })
    } catch (error) {
        console.log("there is a problem while registering th user ", error);
        res.status(404).json({ "message": "user register failer" })


    }

}
export const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(404).json({ "message": "please enter the credentials" })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({ "message": "please register first" })
        }
        //veryfypassword
        const ispasswordCorrect = await user.isPasswordCorrect(password)
        if (!ispasswordCorrect) {
            return res.status(400).json({ "message": "please enter  correct password" })
        }
        const tokens = await GenerteAcesstokenandRefresshToken(user._id)
        //set cokiees
        res.cookie("aceessToken", tokens.aceessToken, cookieOptions)
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions)

        const userresponse={
            id:user._id,
             username:user.username,
            phone:user.phone,
            email:user.email,
            image:user.profilepic,
            role:user.role,
           
        }
        res.status(201).json({ "message": "user succesfully loggedin", userresponse })


    } catch (error) {
        console.log("there is a problem while login th user ", error);
        res.status(404).json({ "message": "user login failer" })

    }
}

export const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $unset: { refreshToken: 1 }
        })

        res.clearCookie("aceessToken", cookieOptions)
        res.clearCookie("refreshToken", cookieOptions)

        return res.status(200).json({ message: "User logged out successfully" })

    } catch (error) {
        console.error("Logout error:", error.message)
        return res.status(500).json({ message: "Logout failed" })  
    }
}



export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log("GetMe error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};



export const updateProfile = async (req, res) => {
    try {
        const { username, image, phone,email,password } = req.body;

        // ❗ prevent empty update
        if (!username && !image && !phone && !email && !password) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // update only provided fields
        if (username) user.username = username;
        if (image) user.image = image;
        if (phone) user.phone = phone;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Update profile error:", error.message);

        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
};