import { Router } from "express";
import { userRouter } from "./users";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SignupSchema } from "src/types";
import client from "@repo/db/client";


export const router = Router();
router.post("/signup",(req, res) => {
    const parsedData = SignupSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message: "Validation failed"})
        return
        }

    try {
        const user = client.user.create({
            data: {
            username: parsedData.data.username,
            password: parsedData.data.password,
            role: parsedData.data.type === "admin" ? "Admin" : "User",
            }
        })
        res.json({
            userId: user.id
        })
    } catch (error) {
        res.status(400).json({message: "User already exist"})
    }

    
})

router.post("/signin",(req, res) => {
    res.json({
        message: "Signin"
    })
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