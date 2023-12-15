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
 * とりあえず登録用のAPIEndpoint
 */

app.post("/v1/school" , async ( req: Request, res: Response ) => {
    
    const body = req.body as {
        token : string,
        data : BaseScheme
    }

    if( 
        typeof body.token !== "string" ||
        typeof body.data !== "object"
    ) return BadRequest( req, res, "ユーザートークン、もしくはBodyDataがObjectではありません。")

    console.log( body )

    const Type = body.token.split(' ')[0]
    const Token = body.token.split(' ')[1]

    if (Type !== "Bearer") return res.status(400).json(
        {
            status: -1,
            body: {
                message: "BadRequest. token type must be Bearer."
            }
        } as BaseRequest<{ message: string }>
    )

    const codeGet = await db.get<string>(Token)

    console.log( codeGet )

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

    const isAlreadyRegistered = await hdb.checkAdd( body.data.schoolId );
    if(!isAlreadyRegistered) return BadRequest( req , res , "もう登録済みです。" )

    const data : BaseScheme = {
        schoolId : body.data.schoolId,
        details : {
            type : body.data.details.type,
            ownerId : user.hid,
            admins : [],
            name : body.data.details.name,
            id : body.data.details.id
        },
        userDatas : []
    }

    await hdb.set( data.schoolId.toString() , JSON.stringify( data ))
    res.status(200).json({
        status : 0,
        body : {
            message : "成功しました。ようこそHSAPIへ！",
            data : data
        }
    } as BaseRequest<{ message : string , data : BaseScheme }>)

})


export default app