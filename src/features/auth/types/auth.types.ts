export interface LoginRequest {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    username: string;
    role: string;
}

export interface AuthUser {
    username: string;
    role: string;
    isAuthenticated: boolean;
}
