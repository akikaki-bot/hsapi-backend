



import { Router , Request , Response } from "express";
import { BaseRequest } from "../../types/baserequest";

const app = Router()

app.get("/v1/about", async ( req : Request , res : Response ) => {

    const Message : BaseRequest<{ message : string }> = {
        status : 1,
        body : {
            message : "APIへようこそ。"
        }
    }

    return res.status(200).json(Message)
})

export default app