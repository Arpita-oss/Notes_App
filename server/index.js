import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth.js'
const app = express()
import connectDB from './db/db.js'

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)


app.listen(5000, ()=>{
    connectDB()
    console.log("Server is running")
})