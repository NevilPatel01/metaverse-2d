import { Router } from "express";

export const userRouter = Router();


userRouter.post("/metadata", (req, res) => {
    res.json({
        message: ""
    })
})

userRouter.get("/api/v1/user/metadata/bulk", (req,res) => { 
    res.json({
        message: ""
    })
})