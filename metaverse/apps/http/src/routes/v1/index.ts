import { Router } from "express";
import { userRouter } from "./users";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "src/types";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import {hash, compare} from "../../scrypt";
import { JWT_PASSWORD } from "src/config";


export const router = Router();
router.post("/signup",async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message: "Validation failed"})
        return
        }

        if (!parsedData.data.password) {
            res.status(400).json({ message: "Password is required" });
            return;
        }
    

        const hashedPassword = await hash(parsedData.data.password)
        try {
        const user = client.user.create({
            data: {
            username: parsedData.data.username,
            password: hashedPassword,
            role: parsedData.data.type === "admin" ? "Admin" : "User",
            }
        })
        res.json({
            userId: (await user).id // This line await might cause an error
        })
    } catch (error) {
        res.status(400).json({message: "User already exist"})
    }

    
})

router.post("/signin",async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(403).json({message: "Validation Failed"})
    }

    if (!parsedData.data?.username || !parsedData.data.password) {
        res.status(403).json({ message: "Username and password are required" });
        return;
    }

    try{
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data?.username
            }
        })
        if(!user){
            res.status(403).json({
                message: "User not found"
            })
            return
        }
        const isValid = await compare(parsedData.data?.password, user.password)
        if(!isValid){
            res.json(403).json({
                message: "Invalid Password"
            })
            return
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.role,
        }, JWT_PASSWORD);

        res.json({
            token
        })
    } catch(e){
        res.status(400).json({message: "Internal server error"})
    }
})

router.get("/elements", (req,res) => {
    res.json({
        message: ""
    })
})

router.get("/avatars", (req,res) => {
    res.json({
        message: ""
    })
})

router.use("/user", userRouter)
router.use("space", spaceRouter)
router.use("admin", adminRouter)