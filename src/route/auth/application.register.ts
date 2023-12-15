

import { Router, Request, Response } from "express";
import { DatabaseCustomizer } from "../../plugins/database";
import { ApplicationRegister } from "../../types/token";
import { BaseRequest } from "../../types/baserequest";
import { User } from "../../types/user";

const app = Router();
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})

app.post("/v1/oauth2/applications", async (req: Request, res: Response) => {
    const RequestToken = req.body as ApplicationRegister
    if (typeof RequestToken.token === "undefined") return res.status(400).json({
        status: -1,
        body: {
            message: "Bad Request. You must include token object in body"
        }
    } as BaseRequest<{ message: string }>)
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

        const codeGet = await db.get<string>(Token)
        if (typeof codeGet === "undefined") return res.status(400).json(
            {
                status: 1,
                body: {
                    message: "Invaild user token."
                }
            } as BaseRequest<{ message: string }>
        )
        const TokenVaildate = db.check(codeGet)
        if(!TokenVaildate || typeof TokenVaildate === "string") return res.status(400).json(
            {
                status : -1,
                body : {
                    message : "Invaild user token or user is unregisted."
                }
            }
        )
        const user = TokenVaildate as User
        if(user.developer === false) return res.status(400).json(
            {
                status : -1,
                body : {
                    message : "You have to turn on your developer user settings."
                }
            }
        )

         user.developerInfo?.applicationName.push(RequestToken.applicationName)
})