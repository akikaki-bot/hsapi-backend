
import { Request , Response } from "express";
import { BaseRequest } from "../types/baserequest";

export function BadRequest ( req: Request, res: Response , errorStatus : string ){
    return res.status(400).json({
        status: 1,
        body: {
            message: "Bad Request.",
            because : errorStatus
        }
    } as BaseRequest<{ message : string; because : string}>)
}