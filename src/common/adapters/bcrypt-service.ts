import bcrypt from "bcrypt";

export class BcryptService{
    async generationHash(password: string) {
        return bcrypt.hash(password, 10);

    }
    async checkPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}