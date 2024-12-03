import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios, { AxiosError } from "axios";
import { Splitter, SplitterPanel } from "primereact/splitter";
import Cookies from "js-cookie"; // Import js-cookie library
import { Dialog } from "primereact/dialog";
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

interface IncomeEntry {
  total: number;
  tip: number;
}

export default function IncomeGraph() {
  const [incomeByDay, setIncomeByDay] = useState<{
    [key: string]: IncomeEntry;
  }>({});
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        // Get the date 7 days ago
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 14);

        const newIncomeByDay: { [key: string]: IncomeEntry } = {};
        rows.forEach((row) => {
          if (row.length >= 7) {
            const date = new Date(row[0]);
            if (date >= twoWeeksAgo && date <= today) {
              const dateString = date.toDateString();
              const total = parseFloat(row[5]);
              const tip = parseFloat(row[6]);

              if (!newIncomeByDay[dateString]) {
                newIncomeByDay[dateString] = { total: 0, tip: 0 };
              }

              newIncomeByDay[dateString].total += total;
              newIncomeByDay[dateString].tip += tip;
            }
          }
        });
        setIncomeByDay(newIncomeByDay);
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

  const chartData = {
    labels: Object.keys(incomeByDay),
    datasets: [
      {
        label: "Total",
        data: Object.values(incomeByDay).map((entry) => entry.total),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 0.8,
      },
      {
        label: "Tip",
        data: Object.values(incomeByDay).map((entry) => entry.tip),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgb(255, 159, 64)",
        borderWidth: 0.8,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Chart
        style={{ height: "400px" }}
        type="bar"
        data={chartData}
        options={chartOptions}
      />
      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        header="Access Denied"
      >
        You need admin permission to see this.
      </Dialog>
    </>
  );
}
