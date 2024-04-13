import {emailAdapter} from "../adapters/email-adapter";
import {emailRouter} from "../email/email-router";

// export const businessService = {
export class BusinessService{
   async sendRegisrtationEmail(email: string, confirmationCode: string){

       const dataMail = emailRouter.getDataMailForRegisrtation(email, confirmationCode)
       await emailAdapter.sandMail(dataMail);
   }
    async sendRecoveryPassword(email: string, confirmationCode: string){

        const dataMail = emailRouter.getDataMailForRecoveryPassword(email, confirmationCode)
        await emailAdapter.sandMail(dataMail);
    }
}