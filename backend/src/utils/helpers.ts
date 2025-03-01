import { pbkdf2Sync, randomBytes } from "node:crypto";

export const hashPassword = (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { salt, hash };
};

export const comparePassword = (
    password: string,
    salt: string,
    hash: string
) => {
    const candidateHash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return candidateHash === hash;
};