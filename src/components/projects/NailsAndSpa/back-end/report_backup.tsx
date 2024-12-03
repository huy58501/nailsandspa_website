/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Papa from "papaparse"; // Import PapaParse library
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import { useRouter } from "next/navigation";
import MenuSideBar from "@/src/components/projects/NailsAndSpa/back-end/menuSideBar";
import { Splitter, SplitterPanel } from "primereact/splitter";
interface CsvRow {
  Date: string;
  CustomerName: string;
  CustomerPhone: string;
  Name: string;
  Service: string;
  Total: string;
  Tip: string;
}

function Reports() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]); // State to store parsed CSV data
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKgREdMDDuuqlNN3Pn-KHevEo97c-lIiw0aQCQjt92cEO8xw4W3-jxCnbrXVpZV59yDU5u6uUNT8mq/pub?gid=0&single=true&output=csv"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const csvText = await response.text();
        const parsedResult = Papa.parse(csvText, { header: true });

        // Convert date format to a valid Date object
        const dataWithValidDate = parsedResult.data.map((row: any) => {
          return {
            ...row,
            Date: new Date(row.Date).toLocaleDateString(),
          };
        });

        setCsvData(dataWithValidDate); // Set parsed CSV data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  const filteredData = csvData.filter((row) =>
    Object.values(row).some((value) =>
      typeof value === "string" ? value.includes(searchQuery) : false
    )
  );

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <div className="card flex">
          {/* Search input */}
          <InputText
            style={{ width: "250px" }}
            type="text"
            placeholder="Search By Phone Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    );
  };
  const header = renderHeader();
  return (
    <div className="main">
      <Splitter>
        <SplitterPanel className="panel-left" size={10}>
          <MenuSideBar />
        </SplitterPanel>
        <SplitterPanel className="panel-right" size={90}>
          <button
            type="button"
            onClick={() => router.push("/projects/sweetienails")}
          >
            Dashboard
          </button>
          <h2 className="card flex justify-content-center">
            Data from Google Sheets:
          </h2>
          <br />
          <DataTable value={filteredData} header={header}>
            {csvData.length > 0 &&
              Object.keys(csvData[0]).map((columnName, index) => (
                <Column
                  sortable
                  key={index}
                  field={columnName}
                  header={columnName}
                />
              ))}
          </DataTable>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}

export default Reports;
