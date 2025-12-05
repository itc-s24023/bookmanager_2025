
import 'express-session'
import 'passport'

declare module 'express-session' {
    interface SessionData {
        messages: string[]
    }
}

declare global {
    namespace Express {
        interface User {
            id: string
            isAdmin: boolean
            server_session: string
            updated_at: number
        }
    }
}

declare module 'passport' {
    interface AuthenticateOptions {
        badRequestMessage?: string | undefined
    }
}