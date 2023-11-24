const sgMail = require("@sendgrid/mail");
const config = require("../config");
sgMail.setApiKey(config.SEND_GRID_API_KEY);


const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const sesTransport = require("nodemailer-ses-transport");

const SES_CONFIG = {
  accessKeyId: config.AWS_SES_ACCESS_KEY,
  secretAccessKey: config.AWS_SES_SECRET_ACCESS_KEY,
  region: config.AWS_SES_REGION,
};

const transporter = nodemailer.createTransport(
  sesTransport({ ses: new AWS.SES(SES_CONFIG) })
);
// const email = (data)=>{
//     return new Promise((resolve, rejects)=>{
//         const msg = {
//           to: data.to,
//           from: "rgaddam@evoketechnologies.com",
//           subject: data.subject,
//           text: data.body,
//           html: data.html,
//           attachments : data.attachments
//         };

//         sgMail
//           .send(msg)
//           .then(() => {
//             console.log("Email sent successfully");
//             resolve("Email sent successfully");
//           })
//           .catch((error) => {
//             console.error("Error sending email:", error);
//             rejects("Error sending email:", error);
//           });
//     })
    

// }



const email = (data)=>{
  return new Promise((resolve, rejects)=>{
      const mailOptions = {
        from: "rgaddam@evoketechnologies.com",
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.body,
        attachments: data.attachments,
      };
      transporter.sendMail(mailOptions).then((res)=>{
        console.log(res);
        resolve(res);
      }).catch((err)=>{
        console.log(err);
        rejects(err);
      })
  })

}


module.exports = email;