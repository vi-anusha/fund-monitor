import express from "express";

const router = express.Router()

router.get("/", (req , res)=>{
    res.send("Funds List")
})

export default router