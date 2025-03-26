import nodemailer from "nodemailer";

type EmailOptions = {
    email: string;
    subject: string;
    msg: string;
};

const sendEmailFn = async ({ email, subject, msg }: EmailOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL as string,
                pass: process.env.APP_PASS as string
            }
        });

        const options = {
            from: "Happy Ecommerce",
            to: email,
            subject: subject,
            html: msg
        };

        mailTransporter.sendMail(options, (err) => {
            if (err) {
                console.error(`Failed to send message to ${email}.`, err);
                reject(err);
            } else {
                console.log(`Message sent successfully to ${email}.`);
                resolve(true);
            }
        });
    });
};

export default sendEmailFn;