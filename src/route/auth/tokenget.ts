



import { Router , Request , Response } from "express";
import { BaseRequest } from "../../types/baserequest";
import { DatabaseCustomizer } from "../../plugins/database";
import { Token } from "../../types/token";

const app = Router()
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})


app.post("/v1/token", async ( req : Request , res : Response ) => {
    const RequestToken = req.body as Token
    if(typeof RequestToken.token === "undefined") return res.status(400).json({
        status : -1,
        body : {
            message : "Bad Request. You must include token object in body"
        }
    } as BaseRequest<{ message : string }>)
    const Type = RequestToken.token.split(' ')[0]
    const Token = RequestToken.token.split(' ')[1]

    if (Type !== "Bearer") return res.status(400).json(
        {
            status: -1,
            body: {
                message: "BadRequest. token type must be Bearer."
            }
        } as BaseRequest<{ message: string }>
    )

    if(typeof Token === "undefined") return res.status(400).json({ status : -1, body : { message : "Invaild token."}} as BaseRequest<{ message : string }>)
    const token = await db.get(Token)
    if(typeof token === "undefined") return res.status(400).json({ status : -1, body : { message : "Invaild token."}} as BaseRequest<{ message : string }>)
    const user = await db.check(token)
    if(!user) return res.status(400).json({ status : -1, body : { message : "Invaild user token."}} as BaseRequest<{ message : string }>)

    return res.status(200).json({
        status : 1,
        body : user
    } as BaseRequest<any>)
})

export default app