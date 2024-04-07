export type LoginInputType = {
    loginOrEmail: string;
    password: string;
}

export type RegisrtationConfirmationCodeModelType = {
    code: string;
}

export type NewPasswordRecoveryInputModel = {
    newPassword: string;
    recoveryCode: string;
}
