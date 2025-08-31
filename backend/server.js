import express from "express";
import fundRoutes from "./routes/funds.js";

const app = express()
const PORT = 8080

app.get('/', (req, res) =>{
    console.log("Here")
    // res.status(500).send("Hi") // set status and send message to user
})

app.use('/funds', fundRoutes)
app.listen(PORT)