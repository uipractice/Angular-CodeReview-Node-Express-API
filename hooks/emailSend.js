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
    const worksheet1 = workbook.addWorksheet("Details");
    const worksheet2 = workbook.addWorksheet("Code Review Checklist");
    const worksheet3 = workbook.addWorksheet("Summary");
    const worksheetData1 = [
      { header: "Project", value: data.project },
      { header: "Developer(s)", value: data.developers },
      {
        header: "Review Packages and Files",
        value: data.reviewPackagesandFiles,
      },

      { header: "Reviewer's Name", value: data.reviewersName },
      {
        header: "Code Review Comments",
        value: data.codeReviewComments,
      },
      { header: "Review Date", value: data.updatedDate },
      {
        header: "Story ID (Enter if applicable)",
        value: data.storyId,
      },
      {
        header: "Project Lead",
        value: data.projectLead,
      },
    ];
    worksheet1.columns = [
      { header: "Account", key: "header", width: 30 },
      { header: data.account, key: "value", width: 20 },
    ];
    worksheet2.columns = [
      { header: "Checklist Item", key: "key", width: 130 },
      { header: "Options", key: "options", width: 10 },
      { header: "Comments", key: "comments", width: 10 },
      { header: "Rating (points)", key: "rating", width: 10 },
      { header: "Achieved Rating", key: "achievedRating", width: 10 },
    ];
    worksheet3.columns = [
      { header: "Code quality (%)", key: "header", width: 20 },
      { header: data.percentage, key: "value", width: 10 },
    ];
    // var worksheetData1 = [
    //   {
    //     project: data.project,
    //     reviewersName: data.reviewersName,
    //     codeReviewComments: data.codeReviewComments,
    //     account: data.account,
    //     developers: data.developers,
    //     reviewPackagesandFiles: data.reviewPackagesandFiles,
    //     updatedDate: data.updatedDate,
    //     storyId: data.storyId,
    //     projectLead: data.projectLead
    //   },
    // ];
    // const worksheetData1 = [
    //   { header: "Account", value: "PrimePay", color: "001F3F" }, // Add color property for 'Account'
    //   { header: "Review Date", value: "4/17/2023" },
    //   { header: "Project", value: "OneX", color: "FF0000" }, // Add color property for 'Project'
    //   { header: "Story ID (Enter if applicable)", value: "NA" },
    //   { header: "Developer(s)", value: "Veera Ramana" },
    //   { header: "Project Lead", value: "NA", color: "00FF00" }, // Add color property for 'Project Lead'
    //   { header: "Review Packages and Files", value: "", color: "FFFF00" }, // Add color property for 'Review Packages and Files'
    //   { header: "Reviewer's Name", value: "Basha/Vinayak" },
    //   { header: "Code Review Comments", value: "" },
    // ];

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
    for (let i = 0; i < worksheetData1.length + 1; i++) {
      const headerCellA = worksheet1.getCell(`A${i + 1}`);
      headerCellA.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerCellA.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "003060" }, // Use the color specified in dataItem
      };
      const headerCellB = worksheet1.getCell(`B${i + 1}`);
      headerCellB.font = { bold: true, color: { argb: "003060" } };
      // headerCellB.fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   // fgColor: { argb: "FFFFFFFF" }, // Use the color specified in dataItem
      // };
    }
    const header3CellA = worksheet3.getCell(`A1`);
    header3CellA.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header3CellA.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "003060" }, // Use the color specified in dataItem
    };
    const header3CellB = worksheet3.getCell(`B1`);
    header3CellB.font = { bold: true, color: { argb: "FFFFFFFF" } };
    let colorCode = "";
    if(data.percentage > 70){
      colorCode = "#32CD32";
    } else if(data.percentage > 30){
      colorCode = "#FFA500";
    } else {
      colorCode = "#FF0000";
    }
    header3CellB.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colorCode }, // Use the color specified in dataItem
    };
    // worksheet1.columns.forEach((column) => {
    //   // console.log('column: ' + column);
    //   const dataItem = worksheetData1.find((item) => {
    //     // console.log(item);
    //     item.header.trim().toLowerCase() === column.header.trim().toLowerCase();
    //   });

    //   // console.log("dataItem: " + dataItem);
    //   // if (dataItem && dataItem.color) {
    //     column.hidden = false;
    //     column.width = 20; // Adjust width if needed
    //     const headerCell = worksheet1.getCell(1, column._number);
    //     headerCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    //     headerCell.fill = {
    //       type: "pattern",
    //       pattern: "solid",
    //       fgColor: { argb: "001F3F" }, // Use the color specified in dataItem
    //     };
    //   // }
    //   //  else {
    //   //   column.hidden = true;
    //   // }
    // });
    worksheetData2.forEach((rowData, rowIndex) => {
      if (!rowData.options) {
        worksheet2.columns.forEach((column, columnIndex) => {
          const cell = worksheet2.getCell(rowIndex + 2, columnIndex + 1); // Row and column indexes are 1-based
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "0000FF" }, // Blue color
          };
        });
      }
    });
    // Generate the Excel file.
    workbook.xlsx.writeBuffer().then((bufferData) => {
    // workbook.xlsx
    //   .writeFile("code-review-checklist.xlsx")
    //   .then(() => {
        // Create the email message with SendGrid
        const msg = {
          to: toEmail,
          from: "rgaddam@evoketechnologies.com",
          subject: `${data.account}-${data.project}: Code review check list`,
          text: "Please review the code review checklist provided in the attached Excel file.",
          attachments: [
            {
              content: bufferData.toString("base64"),
              // content: Buffer.from(
              //   require("fs").readFileSync("code-review-checklist.xlsx")
              // ).toString("base64"),
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

