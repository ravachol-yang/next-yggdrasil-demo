export interface User {
    id: string;
    email: string;
    password: string;
    properties?: {
        name: string;
        value: string;
    }
}

export interface Profile {
    id: string;
    name: string;
    owner: string;
    properties?: {
        name: string;
        value: string;
        signature?: string;
    }
}

export interface Token {
    accessToken: string;
    clientToken: string;
    owner: string;
    profileId?: string;
    createdAt: Date;
}

class YggdrasilException {
    error: string;
    errorMessage: string;
    status: number;
    constructor(error: string, errorMessage: string, status: number) {
        this.error = error;
        this.errorMessage = errorMessage;
        this.status = status;
    }
    toJSON() {
        return {
            error: this.error,
            errorMessage: this.errorMessage,
        }
    }
}

export class ForbiddenOperationException extends YggdrasilException {
    constructor(errorMessage: string) {
        super("ForbiddenOperationException", errorMessage,403);
    }
}

export class IllegalArgumentException extends YggdrasilException {
    constructor() {
        super("IllegalArgumentException", "Access token already has a profile assigned.", 403);
    }
}