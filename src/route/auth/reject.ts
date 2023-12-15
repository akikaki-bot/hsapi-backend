

import { Router, Request, Response } from "express";
import { DatabaseCustomizer } from "../../plugins/database";
import { readFileSync } from "fs"

const app = Router();

app.get("/v1/oauth2/end", async (req: Request, res: Response) => {
    const file = readFileSync(__dirname + "/../../html/oauth2end.html").toString()
    return res.status(200).send(file)
})

export default app