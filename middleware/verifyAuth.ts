import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';


interface CustomRequest extends Request{
    user?:string
}

export const userAuth = (req:CustomRequest, res:Response, next:NextFunction) => {
    try {
        const token:string | null = req.cookies.userToken;
        if(!token){
            return res.status(401).json({ message: 'Access denied. Please Login.' });
        }

        const secret:string | undefined  = process.env.JWT_SECRET;

        if(!secret){
            res.status(500).json({message:"Internal Server Error"});
            return;
        }
        const decode = jwt.verify(token,secret) as { id: string };
        req.user = decode.id
        next();
    } catch (error) {
        console.log(error)
    }
}