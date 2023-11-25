

import { Router, Request, Response } from "express";
import { DatabaseCustomizer } from "../../plugins/database";
import { Token } from "../../types/token";
import { BaseRequest } from "../../types/baserequest";

const app = Router();
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})

app.delete("/v1/oauth2", async (req: Request, res: Response) => {
    const RequestToken = req.body as Token
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

    try {
        const codeGet = await db.get<string>(Token)
        if (typeof codeGet === "undefined") return res.status(400).json(
            {
                status: 1,
                body: {
                    message: "Invaild oauth2 grand token."
                }
            } as BaseRequest<{ message: string }>
        )
        const TokenVaildate = db.vaildOauth2(codeGet)
        if (TokenVaildate) {
            await db.delete(Token)
            return res.status(200)
                .json(
                    {
                        status: 1,
                        body: {
                            message: "Sucessfully delete."
                        }
                    } as BaseRequest<{ message: string }>
                )
        }
        else return res.status(400)
            .json(
                {
                    status: 1,
                    body: {
                        message: "Invaild oauth2 grand token."
                    }
                } as BaseRequest<{ message: string }>
            )
    } catch (err) {
        return res.status(400)
            .json(
                {
                    status: 1,
                    body: {
                        message: "Something wrong."
                    }
                } as BaseRequest<{ message: string }>
            )
    }
})

export default app