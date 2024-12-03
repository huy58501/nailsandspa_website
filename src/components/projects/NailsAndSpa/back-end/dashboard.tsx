import { Splitter, SplitterPanel } from "primereact/splitter";
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import MenuSideBar from "./menuSideBar";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

interface IncomeEntry {
  total: number;
  tip: number;
}

const CountUpAnimation: React.FC<{
  initialValue: number;
  targetValue: number;
}> = ({ initialValue, targetValue }) => {
  const [count, setCount] = useState(initialValue);
  const duration = 3000; // 4 seconds

  useEffect(() => {
    let startValue = initialValue;
    const interval = Math.floor(duration / (targetValue - initialValue));

    const counter = setInterval(() => {
      startValue += 1;
      setCount(startValue);
      if (startValue >= targetValue) {
        clearInterval(counter);
      }
    }, interval);

    return () => {
      clearInterval(counter);
    };
  }, [targetValue, initialValue]);

  return <div className="num">{count}</div>;
};

export default function DashBoard() {
  const [incomeByDay, setIncomeByDay] = useState<{
    [key: string]: IncomeEntry;
  }>({});
  const [chartData, setChartData] = useState({});
  const [chartDataByDay, setChartDataByDay] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [biWeeklyIncomeByDay, setBiWeeklyIncomeByDay] = useState<{
    [key: string]: IncomeEntry;
  }>({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalTips, setTotalTips] = useState(0);
  const [totalGuest, setTotalGuest] = useState(0);
  const [guestChartData, setGuestChartData] = useState({});

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
        const nameDataMap: { [name: string]: { total: number; tip: number } } =
          {};
        // Get the date 7 days ago
        const biweek = new Date();
        biweek.setDate(biweek.getDate() - 30);

        // Process rows for the last 7 days
        rows.forEach((row) => {
          const date = new Date(row[0]); // Assuming Date is at index 0
          if (date >= biweek) {
            const name = row[3]; // Assuming Name is at index 3
            const total = parseFloat(row[5]); // Assuming Total is at index 5
            const tip = parseFloat(row[6]); // Assuming Tip is at index 6

            if (name && !isNaN(total) && !isNaN(tip)) {
              if (nameDataMap[name]) {
                nameDataMap[name].total += total;
                nameDataMap[name].tip += tip;
              } else {
                nameDataMap[name] = { total, tip };
              }
            }
          }
        });

        // Convert the map to labels and datasets for the chart
        const labels = Object.keys(nameDataMap);
        const datasets = [
          {
            label: "Total",
            data: labels.map((name) => nameDataMap[name].total),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 0.8,
          },
          {
            label: "Tip",
            data: labels.map((name) => nameDataMap[name].tip),
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgb(255, 159, 64)",
            borderWidth: 0.8,
          },
        ];

        const data = {
          labels: labels,
          datasets: datasets,
        };

        setChartData(data);
      } catch (error: unknown) {
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

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const options = {
      indexAxis: "x",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: "textColor",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "textColorSecondary",
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    setChartOptions(options);
  }, []);

  useEffect(() => {
    async function fetchBiWeeklyData() {
      try {
        // Retrieve the token from cookies
        const token = Cookies.get("token");

        if (!token) {
          window.location.href = "/projects/sweetienails/login";
          return;
        }

        const biWeeklyIncomeResponse = await axios.get(
          "https://nailsandspa-e594ee8666f0.herokuapp.com/api/data/report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rows: string[][] = biWeeklyIncomeResponse.data || [];
        const dateDataMap: { [date: string]: { total: number; tip: number } } =
          {};
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 30);

        let totalIncomeSum = 0;
        let totalTipSum = 0;

        // Process rows for the last 14 days
        rows.forEach((row) => {
          const date = new Date(row[0]); // Assuming Date is at index 0
          const dateString = date.toDateString();

          if (date >= twoWeeksAgo && date <= today) {
            const total = parseFloat(row[5]);
            const tip = parseFloat(row[6]);

            if (!dateDataMap[dateString]) {
              dateDataMap[dateString] = { total: 0, tip: 0 };
            }

            dateDataMap[dateString].total += total;
            dateDataMap[dateString].tip += tip;

            totalIncomeSum += total;
            totalTipSum += tip;
          }
        });

        // Convert the map to labels and datasets for the chart
        const labels = Object.keys(dateDataMap);
        const datasets = [
          {
            label: "Total",
            data: labels.map((date) => dateDataMap[date].total),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 0.8,
          },
          {
            label: "Tip",
            data: labels.map((date) => dateDataMap[date].tip),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgb(255, 206, 86)",
            borderWidth: 0.8,
          },
        ];

        const data = {
          labels: labels,
          datasets: datasets,
        };

        setTotalIncome(totalIncomeSum);
        setTotalTips(totalTipSum);
        setChartDataByDay(data);
      } catch (error) {
        console.error("Error fetching bi-weekly data:", error);
        // Handle errors
      }
    }

    fetchBiWeeklyData();
  }, []);
  useEffect(() => {
    async function fetchGuestData() {
      try {
        const token = Cookies.get("token");

        if (!token) {
          window.location.href = "/projects/sweetienails/login";
          return;
        }

        const guestResponse = await axios.get(
          "https://nailsandspa-e594ee8666f0.herokuapp.com/api/data/report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rows: string[][] = guestResponse.data || [];
        const guestDataMap: { [name: string]: Set<string> } = {};
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        let totalGuest = 0;
        rows.forEach((row) => {
          const date = new Date(row[0]);
          if (date >= thirtyDaysAgo) {
            const name = row[1]; // Assuming Name is at index 3
            const dateString = date.toDateString();

            if (!guestDataMap[name]) {
              guestDataMap[name] = new Set();
            }

            guestDataMap[name].add(dateString);
          }
        });

        const guestCounts = Object.entries(guestDataMap).map(([name, dates]) => ({
          name,
          count: dates.size,
        }));

        guestCounts.sort((a, b) => b.count - a.count);
        const topGuests = guestCounts.slice(0, 6);

        const labels = topGuests.map((guest) => guest.name);
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Visits",
              data: topGuests.map((guest) => guest.count),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
            },
          ],
        };
        // Set total guests count
        const totalGuestCount = guestCounts.reduce((acc, guest) => acc + guest.count, 0);
        setGuestChartData(data);
        setTotalGuest(totalGuestCount);
      } catch (error) {
        console.error("Error fetching guest data:", error);
      }
    }

    fetchGuestData();
  }, []);
  return (
    <>
      <MenuSideBar />
      <div className="dashboard">
        <div className="countup-wrapper flex">
          <div className="countup-item">
            <h2>Total Income:</h2>
            <div className="circle">
              <CountUpAnimation initialValue={0} targetValue={totalIncome} />
            </div>
            
          </div>
          <div className="countup-item">
            <h2>Total Visits:</h2>
            <div className="circle">
              <CountUpAnimation initialValue={0} targetValue={totalGuest} />
            </div>
          </div>
          <div className="countup-item">
            <h2>Total Tips:</h2>
            <div className="circle">
              <CountUpAnimation initialValue={0} targetValue={totalTips} />
            </div>
          </div>
        </div>

        <div className="dashboard-chart">
          <Chart
            className="flex-item"
            type="bar"
            data={chartDataByDay}
            options={chartOptions}
            style ={{width: '100%'}}
          />
          <span>
            <b>Total and Tips income in last 30 Days</b>
          </span>
        </div>

        <div className="countup-wrapper-chart">
          <div className="countup-item">
            <div className="dashboard-chart">
              <Chart
                className='charts'
                type="bar"
                data={chartData}
                options={chartOptions}
                style={{width: '600px'}}
              />
              <span>
                <b>Employeer income in last 30 Days</b>
              </span>
            </div>
          </div>
          <div className="countup-item">
            <div className="dashboard-chart" >
              <Chart
                className='charts'
                type="bar"
                data={guestChartData}
                options={chartOptions}
                style={{width: '600px'}}
              />
              <span>
                <b>Top customer in last 30 Days</b>
              </span>
            </div>
          </div>
        </div>
      </div>

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
