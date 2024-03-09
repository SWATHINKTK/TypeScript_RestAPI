import 'dotenv/config';
import express, {Request, Response} from "express";
import cookieParser from 'cookie-parser';


import userRouter from "./routers/userRouter";
import { connectDB } from './db';

const app = express();
connectDB();

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/',userRouter)


const PORT = 3000
app.listen(PORT,() => {
    console.log(`Server is running at http://localhost:${PORT}`)
})


