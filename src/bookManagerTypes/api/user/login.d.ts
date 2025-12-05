export type user_login_request = {
    email: string;
    password: string;
}

export type user_login_response_200 = {
    message: "ok";
}

export type user_login_response_401 = {}