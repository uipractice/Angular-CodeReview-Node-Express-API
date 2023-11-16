const ExcelJS = require("exceljs");

function sendEmail(data) {
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
      { header: "Checklist Item", key: "key", width: 100 },
      { header: "Options", key: "options", width: 10 },
      { header: "Comments", key: "comments", width: 30 },
      { header: "Rating (points)", key: "rating", width: 10 },
      { header: "Achieved Rating", key: "achievedRating", width: 10 },
    ];
    worksheet3.columns = [
      { header: "Code quality (%)", key: "header", width: 20 },
      { header: data.percentage, key: "value", width: 10 },
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
    for (let i = 0; i < worksheetData1.length + 1; i++) {
      const headerCellA = worksheet1.getCell(`A${i + 1}`);
      headerCellA.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerCellA.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "003060" },
      };
      const headerCellB = worksheet1.getCell(`B${i + 1}`);
      headerCellB.font = { bold: true, color: { argb: "003060" } };
    }
    const header3CellA = worksheet3.getCell(`A1`);
    header3CellA.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header3CellA.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "003060" }, 
    };
    const header3CellB = worksheet3.getCell(`B1`);
    header3CellB.font = { bold: true, color: { argb: "FFFFFFFF" } };
    let colorCode = "";
    if(data.percentage > 70){
      colorCode = "#00FF00";
    } else if(data.percentage > 30){
      colorCode = "#FFA500";
    } else {
      colorCode = "#FF0000";
    }
    header3CellB.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colorCode }, 
    };
    var dataKeys = data.data.map((item)=>{
      return item.key;
    })
    worksheetData2.forEach((rowData, rowIndex) => {
      if (!rowData.options) {
        const row = worksheet2.getRow(rowIndex + 2);
        if (dataKeys.includes(rowData.key)) {
          // Highlight the entire row
          
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "003060" },
            };
            worksheet2.mergeCells(`A${rowIndex + 2}:E${rowIndex + 2}`);
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        } else {
          worksheet2.columns.forEach((column, columnIndex) => {
            const cell = worksheet2.getCell(rowIndex + 2, columnIndex + 1);
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "0000FF" },
            };
            cell.alignment = {
              vertical: "middle",
              horizontal: "left",
              wrapText: true
            };
          });
        }
         row.height = "auto";
      }
    });
    workbook.xlsx.writeBuffer().then((bufferData) => {
        resolve(bufferData);
      })
      .catch((error) => {
        console.log(error);
        console.error("Error generating Excel file:", error);
        rejects("Error sending email:", error);
      });
  });
  
}

module.exports = sendEmail;

