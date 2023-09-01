import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import 'module-alias/register';

const app = express();
import { loadRoutes } from '@api/index';
dotenv.config();

app.use(cors({
    origin:['http://localhost:3000']
}))

app.use(express.json())
app.use("/api", loadRoutes());

app.listen(3000,() => {
    console.log("API is running on port 3000!");
})