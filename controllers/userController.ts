import express,{Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { userModel, User } from "../models/userModel";





const passwordHash = async(password:string):Promise<string> => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,salt);
}


export class UserController{
    home(req:Request, res:Response){
        res.json({message:'Home Page Succesfully Loaded.'})
    }

    async register(req:Request, res:Response):Promise<undefined>{
        try {
            const {username, email, password }:User = req.body;
            
            if(!(username && email && password)){
                res.status(400).json({message: "All fields are required." });
                return;
            }


            const existingUser:User | null = await userModel.findOne({email:email});
            if(existingUser){
                res.status(400).json({message: "User is Already Exist." });
                return;
            }

            const strongPassword:string = await passwordHash(password)

            const user = new userModel({
                username,
                email,
                password:strongPassword
            });
            
            const savedUser = await user.save();

            if(savedUser){
                res.status(200).json({message:'User Registration Successful'});
            }
        
        } catch (error) {
            console.log(error)
        }
    }

    async login(req:Request, res:Response):Promise<undefined>{
            try {
                const { username, password } = req.body;
        
                if(!(username && password)){
                    res.status(400).json({message: "All fields are required." });
                    return;
                }

                const existingUser:User | null = await userModel.findOne({email:username});
                if(!(existingUser && await bcrypt.compare(password, existingUser.password))){
                    res.status(400).json({message:"Check Username and Password"});
                    return;
                }


                const secret:string | undefined  = process.env.JWT_SECRET

                if(!secret){
                    res.status(500).json({message:"Internal Server Error"});
                    return;
                }

                const token:string = jwt.sign({id:existingUser._id},secret ,{
                    expiresIn:'1d'
                })

                res.status(201).cookie('userToken',token,{
                    maxAge: 86400000, 
                    secure: true,
                    httpOnly: true,
                    sameSite: 'strict'
                }).json({
                    message:'User Login Successful.'
                });
                
            } catch (error) {
                console.log(error)
            }
    }

    logout(req:Request, res:Response){
        res.status(200).clearCookie('userToken').json({ message: 'User is Logged out.'});
    }
}