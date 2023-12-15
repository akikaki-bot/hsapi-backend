import {
    Router,
    Request,
    Response
} from "express"
import { BaseScheme, Dates, EventData, Subjects, TimeData, UserDatas } from "../../types/scheme";
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


const val: {
    schoolId: number,
    token: string
    bodies: {
        headKey: keyof Omit<BaseScheme, "schoolId">,
        key: string,
        value: number | string,
    }[]
} = {
    schoolId: 0,
    token: "a",
    bodies: [{
        headKey: "details",
        key: "type",
        value: 0
    }]
}

/**
 * 部分変更用の API EndPoint
 */

app.patch("/v1/school", async (req: Request, res: Response) => {
    const body = req.body as {
        schoolId: number,
        token: string
        bodies: Array<{
            headKey: "details",
            key: string,
            value: number | string | object,
        } | {
            headKey: "userDatas"
            grade: number,
            class : number,
            date: Dates,
            key: "timelineData"
            index?: number
            value: Subjects[] | Subjects
        } | {
            headKey: "userDatas"
            grade: number,
            class : number,
            date: Dates,
            key: "eventData"
            value: EventData | EventData[]
        }>
    };

    if (
        typeof body.token !== "string" ||
        typeof body.bodies !== "object"
    ) return BadRequest(req, res, "ユーザートークン、もしくはBodyDataがObjectではありません。")

    console.log(body)

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

    if (typeof codeGet === "undefined") return res.status(400).json(
        {
            status: 1,
            body: {
                message: "Invaild user token."
            }
        } as BaseRequest<{ message: string }>
    )
    const TokenVaildate = db.check(codeGet)
    if (!TokenVaildate || typeof TokenVaildate === "string") return res.status(400).json(
        {
            status: -1,
            body: {
                message: "Invaild user token or user is unregisted."
            }
        }
    )

    const Errors: { message: string, value: string, be: string }[] = []

    const user = TokenVaildate as User

    const isAlreadyRegistered = await hdb.checkAdd(body.schoolId);
    if (isAlreadyRegistered) return BadRequest(req, res, "登録されていない高校・もしくは教育機関です。")

    if (!Array.isArray(body.bodies)) return BadRequest(req, res, "Invaild body type. this option must be array.")

    const parseData = await hdb.get(body.schoolId)
    console.log(parseData)
    const data = JSON.parse(parseData) as BaseScheme;

    body.bodies.map(async (value) => {
        if (value.headKey === "details") {
            console.log(
                data.details,
                data.details[`${value.key}`],
                typeof data.details[`${value.key}`],
                typeof value.value,
            )
            if (typeof value.value !== typeof data.details[`${value.key}`]) return Errors.push({ message: "Invalid type.", value: data.details[`${value.key}`].toString(), be: typeof data.details[`${value.key}`] })
            if (typeof data.details[`${value.key}`] === "undefined") return Errors.push({ message: "Invalid type.", value: data.details[`${value.key}`].toString(), be: typeof data.details[`${value.key}`] })
            data.details[`${value.key}`] = value.value
            console.log(data.details)
        }

        if (value.headKey === "userDatas") {
            console.log(`
             Grade : ${value.grade},
             date : ${value.date},
             key : ${value.key},
             value : ${value.value}
            `)

            if(
                typeof (value.grade) === "undefined" ||
                typeof value.class === "undefined"
            ) return Errors.push({ message : "bad request. grade and class number is must be specified." , value : "undefined", be : "number" }) 

            const gradeData = data.userDatas?.find(grade => (grade.grade === value.grade && grade.class === value.class)) 


            //if(typeof gradeData !== "undefined" && (typeof value.value !== typeof gradeData[`${value.key}`][`${value.date}`])) Errors.push({ message: "Invalid type.", value: gradeData[`${value.key}`].toString() , be : typeof gradeData[`${value.key}`][`${value.date}`] })
            //if(gradeData && typeof gradeData[`${value.key}`] === "undefined") return Errors.push({ message: "Invalid type.", value: gradeData[`${value.key}`].toString() , be : typeof data.userDatas[`${value.key}`][`${value.date}`] })
            console.log( gradeData )
            if (typeof gradeData === "undefined") {
                if(!Array.isArray(data.userDatas)) data.userDatas = [];
                data.userDatas.push({
                    grade: value.grade,
                    class : value.class,
                    timelineData: {
                        sun: [],
                        mon: [],
                        tue: [],
                        wed: [],
                        thu: [],
                        fri: [],
                        sat: []
                    },
                    eventData: {
                        sun: [],
                        mon: [],
                        tue: [],
                        wed: [],
                        thu: [],
                        fri: [],
                        sat: []
                    }
                })
                const gradeSession = data.userDatas.find(grade => (grade.grade === value.grade && grade.class === value.class))
                if (typeof gradeSession === "undefined") return res.status(500).json({ status: -1, body: { message: "uncaught server error. session is undefined. " } })
                if (typeof value.value !== "object") return BadRequest(req, res, "Invaild type. ")

                switch (value.key) {
                    case "eventData":
                        gradeSession[`${value.key}`][`${value.date}`] = Array.isArray(value.value) ? value.value : [value.value];
                        break;
                    case "timelineData":
                        gradeSession[`${value.key}`][`${value.date}`] = Array.isArray(value.value) ? value.value : [value.value];
                        break;
                }
            }
            else {
                if (typeof value.value !== "object") return BadRequest(req, res, "Invaild type. ")
                switch (value.key) {
                    case "eventData":
                        gradeData[`${value.key}`][`${value.date}`] = Array.isArray(value.value) ? [...gradeData[`${value.key}`][`${value.date}`], ...value.value] : [value.value];
                    break;
                    case "timelineData":
                        console.log(value.index)
                        if (typeof value.index !== "undefined" && !isNaN(+value.index)) {
                            if (Array.isArray(value.value)) return Errors.push({ message : "Invaild object. when provide a index number, you must provide a object type Subject data." , value : "array", be : "object" })
                            //if(typeof gradeData[`${value.key}`][`${value.date}`][+value.index] === "undefined") return BadRequest(req, res, "Out of range. you must be provide a valid number.") 
                            gradeData[`${value.key}`][`${value.date}`][+value.index] = value.value
                        } else {
                            gradeData[`${value.key}`][`${value.date}`] = Array.isArray(value.value) ? value.value : [value.value];
                        }
                    break;
                }
            }
        }
    })
    if(Errors.length === 0) await hdb.set(body.schoolId.toString(), JSON.stringify(data))
    return res.status(200).json({ status: Errors.length !== 0 ? -1 : 0, body: { message: Errors.length !== 0 ? Errors : "Success" } } as BaseRequest<{ message: object[] | string }>)
})

export default app