



import { Router , Request , Response } from "express";
import { BaseRequest } from "../../types/baserequest";
import { DatabaseCustomizer } from "../../plugins/database";

const app = Router()
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})


app.get("/v1/token", async ( req : Request , res : Response ) => {
    const userToken = await db.generateUser({
        hid : 1,
        username : "開発者その2",
        developer : true,
        developerInfo : {
            token : null,
            redirects : ["http://localhost:3031/"],
            applicationName : ["hs-api-dev-2"]
        },
        email : "nubejson@gmail.com"
    })
    await db.set(userToken.toString().split('.')[2], userToken)
    return res.status(200).json({
        status : 1,
        body : {
            token : userToken.toString().split('.')[2]
        }
    } as BaseRequest<{ token : string}>)
})

export default app