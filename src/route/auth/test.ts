



import { Router , Request , Response } from "express";
import { BaseRequest } from "../../types/baserequest";
import { DatabaseCustomizer } from "../../plugins/database";

const app = Router()
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})


app.get("/v1/token", async ( req : Request , res : Response ) => {
    const userToken = await db.generateUser(`test`)
    await db.set(userToken.toString().split('.')[1], userToken)
    return res.status(200).json({
        status : 1,
        body : {
            token : userToken
        }
    } as BaseRequest<{ token : string}>)
})

export default app