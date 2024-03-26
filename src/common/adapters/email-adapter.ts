import nodemailer from 'nodemailer'
import {SETTING} from "../../main/setting";
import {DataMailType} from "../types/mail.types";

export const emailAdapter = {

    async sandMail(dataMail: DataMailType) {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "testovaelena636@gmail.com",
                pass: SETTING.PASSWORD_FOR_EMAIL
            },
        });


        return  await transporter.sendMail(dataMail);

    }
}