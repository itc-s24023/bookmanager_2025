export type user_register_request = {
    email: string;
    name: string;
    password: string;
}

export type user_register_response_200 = {}

export type user_register_response_400 = {
    reason: string;
}