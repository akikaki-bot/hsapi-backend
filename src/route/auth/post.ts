

import { Router, Request, Response } from "express";
import { DatabaseCustomizer } from "../../plugins/database";
import { Token } from "../../types/token";
import { BaseRequest } from "../../types/baserequest";

const app = Router();
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})

app.post("/v1/oauth2", async (req: Request, res: Response) => {
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

    try {
        const _Token = await db.get(Token)
        if(typeof _Token === "undefined") return res.status(400).json({
            status : -1,
            body : {
                message : "Authoirzation failed. Check your token is vaild..."
            }
        } as BaseRequest<{ message : string }>)

        const TokenVaildate = db.check(_Token)
        if (TokenVaildate){
            const token = db.oauth2Code(Token)
            await db.set<string>(token.split('.')[2] , token)
            return res.status(200).json({
                status : 0,
                body : {
                    token : token.split('.')[2],
                    expiresAt : "1hour"
                }
            } as BaseRequest<{ token : string , expiresAt : "1hour" }>)
        }
    } catch (err) {
        return res.status(400).json({
            status : -1,
            body : {
                message : "Authoirzation failed. Check your token is vaild..."
            }
        } as BaseRequest<{ message : string }>)
    }
})

export default app