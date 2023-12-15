

// Packages
import  express from "express"
import 'dotenv/config'

if(
    typeof process.env.oauth2time === "undefined" ||
    typeof process.env.jwtKey === "undefined"
) throw new Error('環境変数設定しろ禿')

// Plugins
import { limiter } from "./plugins/ratelimit";

const app = express();
app.listen(3031, () => {
    console.log("Started Serve.r")
})

app.use(limiter)
app.use(express.urlencoded({extended: true}))
app.use(express.json())



import about from "./route/v1/about"
app.get("/v1/about" , about)

import oauth2grand from "./route/auth/post"
app.post("/v1/oauth2", oauth2grand)

import oauth2check from "./route/auth/get"
app.get("/v1/oauth2" , oauth2check)

import generateuser from "./route/auth/test"
app.get("/v1/token" , generateuser)

import oauth2delete from  "./route/auth/delete"
app.delete('/v1/oauth2', oauth2delete)

import oauth2patch from  "./route/auth/patch"
app.patch('/v1/oauth2', oauth2patch)

import post from "./route/auth/tokenget"
app.post('/v1/user', post)

import reject from "./route/auth/reject"
app.get('/v1/oauth2/end', reject)

import register from "./route/school/register"
app.post(`/v1/school` , register )

import get from "./route/school/get"
app.get('/v1/school/:id', get)

import patch from "./route/school/patch";
app.patch("/v1/school", patch)