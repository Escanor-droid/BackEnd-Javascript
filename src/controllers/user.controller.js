import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req , res) => {
    // user registration logic will go here
    // user data needs to be retrieved from frontend
    // validation of user data
    // check if user already exists: email or username
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and response token field from the response
    // check for user creation success
    // and appropriate response should be sent back


    const {fullName, email, username, password } = req.body;
    console.log(fullName);

    if ([fullName, email, username, password].some((field) => 
        field?.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required");
    }
    if(email.indexOf('@') === -1){
        throw new ApiError(400, "Invalid email address");
    }
    // more validation can be added here
    const existingUser = User.findOne({
        $or: [{username},{email}]
    })
    if(existingUser){
        throw new ApiError(409, "User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase() 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "something went wrong while registering");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered successfully")
    )


})

export {registerUser}