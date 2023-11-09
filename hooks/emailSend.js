const sgMail = require("@sendgrid/mail");
const ExcelJS = require("exceljs");
const fs = require("fs");
const config = require('../config');

// Set your SendGrid API key
sgMail.setApiKey(config.SEND_GRID_API_KEY);

function sendEmail(data, toEmail) {
  // Create a new Excel workbook and add a worksheet.
  return new Promise((resolve, rejects) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet1 = workbook.addWorksheet("Review-Details");
    const worksheet2 = workbook.addWorksheet("CheckList-Details");
    worksheet1.columns = [
      { header: "Account", key: "account", width: 15 },
      { header: "Project", key: "project", width: 15 },
      { header: "Reviewer", key: "reviewersName", width: 25 },
      { header: "Comments", key: "comments", width: 10 },
      { header: "Percentage", key: "percentage", width: 10 },
    ];
    worksheet2.columns = [
      { header: "Checklist Item", key: "key", width: 130 },
      { header: "Options", key: "options", width: 10 },
      { header: "Comments", key: "comments", width: 10 },
      { header: "Rating (points)", key: "rating", width: 10 },
      { header: "Achieved Rating", key: "achievedRating", width: 10 },
    ];
    var worksheetData1 = [
      {
        project: data.project,
        reviewersName: data.reviewersName,
        comments: data.comments,
        percentage: data.percentage,
        account: data.account
      },
    ];

    var worksheetData2 = [];
    function setItems(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value) {
          worksheetData2.push({ key: arr[i].key });
          setItems(arr[i].value);
        } else {
          worksheetData2.push({
            key: arr[i].key,
            options: arr[i].options,
            comments: arr[i].comments,
            rating: arr[i].rating,
            achievedRating: arr[i].achievedRating,
          });
        }
      }
    }

    setItems(data.data);
    worksheet1.addRows(worksheetData1);

    worksheet2.addRows(worksheetData2);

    worksheetData2.forEach((rowData, rowIndex) => {
      if (!rowData.options) {
        worksheet2.columns.forEach((column, columnIndex) => {
          const cell = worksheet2.getCell(rowIndex + 2, columnIndex + 1); // Row and column indexes are 1-based
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "0000FF" }, // Blue color
          };
        });
      }
    });
    // Generate the Excel file.
    workbook.xlsx
      .writeFile("tmp/code-review-checklist.xlsx")
      .then(() => {
        // Create the email message with SendGrid
        const msg = {
          to: toEmail,
          from: "rgaddam@evoketechnologies.com",
          subject: "Code Review Checklist Excel File Attached",
          text: "Check out the attached Excel file for the code review checklist",
          attachments: [
            {
              content: Buffer.from(
                require("fs").readFileSync("tmp/code-review-checklist.xlsx")
              ).toString("base64"),
              filename: "code-review-checklist.xlsx",
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              disposition: "attachment",
            },
          ],
        };

        // Send the email with the attached Excel file.
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
      .catch((error) => {
        console.log(error);
        console.error("Error generating Excel file:", error);
        rejects("Error sending email:", error);
      });
  });
  
}

module.exports = sendEmail;

