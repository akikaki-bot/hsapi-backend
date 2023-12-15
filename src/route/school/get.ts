import {
    Router,
    Request,
    Response
} from "express"
import { BaseScheme } from "../../types/scheme";
import { BadRequest } from "../../plugins/badrequest";
import { DatabaseCustomizer } from "../../plugins/database";
import { BaseRequest } from "../../types/baserequest";
import { User } from "../../types/user";

const app = Router();

const db = new DatabaseCustomizer({
    url: "sqlite://db/oauth.dat"
})

const hdb = new DatabaseCustomizer({
    url: "sqlite://db/h.dat"
})

/**
 * Publicな公開（？）取得 API EndPoint
 */

app.get("/v1/school/:id" , async ( req: Request, res: Response ) => {
    const schoolId = req.params.id.toString()

    const data = await hdb.get( schoolId )
    if( typeof data === "undefined" ) return BadRequest( req, res, "Not Found School Data")

    return res.status(200).json({
        status : 0,
        body : {
            message: "成功しました。",
            data : JSON.parse(data) as BaseScheme
        }
    } as BaseRequest<{ message : string , data : BaseScheme }>)
})

export default app