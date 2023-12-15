


export interface Token {
    token : string
}

export interface ApplicationRegister extends Token {
    /* ユーザートークン */
    token : string 
    /* アプリケーションの名前 */
    applicationName : string
    /* 必要な権限 */
    intents ?: Intents[]
}

export type Intents = 
| "Read" 
| "User" 
| "ALL"