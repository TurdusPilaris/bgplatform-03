import {businessService} from "../src/common/domain/business-service";

export const emailServiceMock: typeof businessService = {
    async sendRegisrtationEmail(email: string, confirmationCode: string) {

    }
}