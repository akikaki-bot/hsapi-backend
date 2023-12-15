import Keyv from "keyv";
import { sign, verify } from "jsonwebtoken";
import { User } from "../types/user";

export interface DatabaseConfig {
    url: string
}

export class DatabaseCustomizer {

    private keyv: Keyv<any>

    constructor(option?: DatabaseConfig) {
        if (typeof option !== "undefined") {
            this.keyv = new Keyv({
                uri: option.url
            })
        } else {
            this.keyv = new Keyv({
                uri: "sqlite://db/main.sqlite"
            })
        }


    }

    async set<T = any>(key: string, value: T) {
        return await this.keyv.set(key, value)
    }

    async delete(key: string) {
        return await this.keyv.delete(key)
    }

    async get<T = any>(key: any) {
        return await this.keyv.get(key) as T
    }

    async checkAdd( key : any ) : Promise<boolean> {
        return typeof (await this.keyv.get( key ) ) === "undefined"
    }

    /**
     * 
     * use for login
     * 
     * @param password 
     * @param token 
     * @returns 
     */
    auth(password: string, token: string) {
        return verify(token, password)
    }

    generateUser( user : User ) {
        if (
            typeof process.env.oauth2time === "undefined" ||
            typeof process.env.jwtKey === "undefined"
        ) throw new Error('環境変数設定しろ禿')

        try {
            return sign({ apiuser : user}, process.env.jwtKey)
        } catch (e) {
            return false
        }
    }
    /*
    generateUser(username: string) {
        if (
            typeof process.env.oauth2time === "undefined" ||
            typeof process.env.jwtKey === "undefined"
        ) throw new Error('環境変数設定しろ禿')

        try {
            return sign({ username: username }, process.env.jwtKey)
        } catch (e) {
            return false
        }
    }*/

    /**
     * /api/v1 all required.
     * 
     * /api/oauth2 code generate required.
     * 
     * @param token 
     * @returns 
     */
    check(token: string) {
        if (
            typeof process.env.oauth2time === "undefined" ||
            typeof process.env.jwtKey === "undefined"
        ) throw new Error('環境変数設定しろ禿')

        try {
            return verify(token, process.env.jwtKey)
        } catch (e) {
            return false
        }
    }

    /**
     * /auth/oauth2 required.
     * 
     * Generate oauth2 one time token, expires at 1 day
     * @param user 
     * @returns 
     */
    oauth2Code(user: string) {
        if (
            typeof process.env.oauth2time === "undefined" ||
            typeof process.env.jwtKey === "undefined"
        ) throw new Error('環境変数設定しろ禿')

        return sign(
            { userId: user },
            process.env.oauth2time,
            { expiresIn: "1hour" }
        )
    }

    /**
     * POST /auth/oauth2 required.
     * 
     * Is vaild auth? lets check this function.
     * @param token 
     * @returns 
     */
    vaildOauth2(token: string) {
        if (
            typeof process.env.oauth2time === "undefined" ||
            typeof process.env.jwtKey === "undefined"
        ) throw new Error('環境変数設定しろ禿')
        try {
            const data = verify(token, process.env.oauth2time)
            return data
        } catch (err) {
            return false
        }
    }
}