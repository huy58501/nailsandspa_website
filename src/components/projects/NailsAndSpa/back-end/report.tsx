/* eslint-disable @typescript-eslint/no-explicit-any */
import MenuSideBar from "@/src/components/projects/NailsAndSpa/back-end/menuSideBar";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
declare module "file-saver";
import Cookies from "js-cookie"; // Import js-cookie library
import axios, { AxiosError } from "axios";
import { Dialog } from "primereact/dialog";
import jsPDF from "jspdf";
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

interface IncomeReport {
  date: string;
  cusName: string;
  cusPhone: string;
  empName: string;
  service: string;
  total: number;
  tip: string;
}

interface ColumnMeta {
  field: keyof IncomeReport; // Use keyof to ensure the field property matches the keys of IncomeReport
  header: string;
}

function Reports() {
  const [income, setIncome] = useState<IncomeReport[]>([]);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredIncome, setFilteredIncome] = useState<IncomeReport[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const cols: ColumnMeta[] = [
    { field: "date", header: "Date" },
    { field: "cusName", header: "Customer Name" },
    { field: "cusPhone", header: "Customer Phone" },
    { field: "empName", header: "Employmer Name" },
    { field: "service", header: "Service" },
    { field: "total", header: "Total" },
    { field: "tip", header: "Tip" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  useEffect(() => {
    async function fetchData() {
      try {
        // Retrieve the token from cookies
        const token = Cookies.get("token");

        if (!token) {
          window.location.href = "/projects/sweetienails/login";
          return;
        }

        const incomeResponse = await axios.get(
          "https://nailsandspa-e594ee8666f0.herokuapp.com/api/data/report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const rows: string[][] = incomeResponse.data || [];
        const newIncomeByDay: IncomeReport[] = rows.map((row) => ({
          date: row[0],
          cusName: row[1],
          cusPhone: row[2],
          empName: row[3],
          service: row[4],
          total: parseFloat(row[5]),
          tip: row[6],
        }));

        setIncome(newIncomeByDay);
        setFilteredIncome(newIncomeByDay);
      } catch (error: unknown) {
        // Explicitly type error as unknown
        console.error("Error fetching data:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError; // Cast error to AxiosError
          if (axiosError.response && axiosError.response.status === 403) {
            setErrorMessage("User does not have access to this resource.");
            setVisible(true);
          } else {
            setErrorMessage("An error occurred while fetching data.");
          }
        } else {
          setErrorMessage("An error occurred while fetching data.");
        }
      }
    }

    fetchData();
  }, []); 

  const exportPdf = () => {
    import("jspdf-autotable").then(() => {
      const doc = new jsPDF();

      (doc as any).autoTable(exportColumns, income);
      doc.save("income.pdf");
    });
  };
/*
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(income);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "income");
    });
  };
*/
  const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      cols.map((col) => col.header).join(",") +
      "\n" +
      income
        .map((item) => cols.map((col) => item[col.field]).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "income.csv");
    document.body.appendChild(link);
    link.click();
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    if (searchValue) {
      const filtered = income.filter((item) =>
        item.cusPhone.includes(searchValue)
      );
      setFilteredIncome(filtered);
    } else {
      setFilteredIncome(income);
    }
  };

  const header = (
    <div className="flex align-items-center justify-content-between">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by phone number"
        />
      </div>
      <div className="export-buttons">
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV()}
          data-pr-tooltip="CSV"
        />
        <span style={{ marginRight: '20px' }}></span> 
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          //onClick={exportExcel}
          data-pr-tooltip="XLS"
        />
        <span style={{ marginRight: '20px' }}></span> 
        <Button
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
    </div>
  );

  return (
    <div>
      <MenuSideBar />
      <div className="main">
        <Tooltip target=".export-buttons>button" position="bottom" />
        <DataTable
          value={filteredIncome}
          header={header}
          tableStyle={{ minWidth: "50rem" }}
        >
          {cols.map((col, index) => (
            <Column sortable style={{ width: '25%' }} key={index} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </div>

      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        header="Access Denied"
      >
        You need admin permission to see this.
      </Dialog>
    </div>
  );
}

export default Reports;
