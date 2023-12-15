

export interface BaseUser {
    hid : number
    username : string
    email : string
}

export interface User extends BaseUser {
    developer : boolean
    developerInfo ?: DeveloperSetting
}

export interface DeveloperSetting {
    token : string | null
    redirects : string[]
    applicationName : string[]
}