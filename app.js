import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import router from "./routes/router.js";
import cors from "cors";
const port = 8004;


// middle ware
app.use(express.json());
app.use(cors());
app.use(router);

app.get("/",(req,res)=>{
    res.send("Express Vercel is working");
})


app.listen(port,()=>{
    console.log(`server start at port no :${port}`)
})