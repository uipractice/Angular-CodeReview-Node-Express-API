const sgMail = require("@sendgrid/mail");
const config = require("../config");
sgMail.setApiKey(config.SEND_GRID_API_KEY);

const email = (data)=>{
    return new Promise((resolve, rejects)=>{
        const msg = {
          to: data.to,
          from: "rgaddam@evoketechnologies.com",
          subject: data.subject,
          text: data.body,
          html: data.html,
          attachments : data.attachments
        };

        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent successfully");
            resolve("Email sent successfully");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            rejects("Error sending email:", error);
          });
    })
    

}


module.exports = email;