
import { Router, Request, Response } from "express";
import { DatabaseCustomizer } from "../../plugins/database";
import { Token } from "../../types/token";
import { BaseRequest } from "../../types/baserequest";
import { readFileSync } from "fs"

const app = Router();
const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})

app.get("/v1/oauth2", async (req: Request, res: Response) => {
    const code = req.query.code
    const type = req.query.type
    const redirect = req.query.redirect

    if(
        typeof code === "undefined" ||
        typeof type === "undefined" ||
        typeof redirect === "undefined" 
    ) {
        return res.status(400).send(`<h1> Invaild oauth2 type. </h1>`)
    }

    const codeGet = await db.get<string>(code)
    if(typeof codeGet === "undefined") return res.status(400).send(`<h1> Invaild oauth2 token. </h1>`)

    const oauth2TokenVaild = db.vaildOauth2(codeGet)
    if(!oauth2TokenVaild) return res.status(400).send(`<h1> Invaild oauth2 token. </h1>`)

    const file = readFileSync(__dirname + "/../../html/oauth2grand.html").toString()
    return res.status(200).send(file)
})

export default app