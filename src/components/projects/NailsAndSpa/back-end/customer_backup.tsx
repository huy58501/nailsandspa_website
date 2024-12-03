/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import MenuSideBar from "@/src/components/projects/NailsAndSpa/back-end/menuSideBar";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

interface Customer {
  id: number;
  Name: string;
  Phone: string;
  Point: string;
}
function CustomerInfo() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [api] = useState(
    "https://script.google.com/macros/s/AKfycbzJ1mBMWBR2-LCVmdELQHmSkdBtDKcPnM8bX7K5PFGwn49-5_TLD62gVbUNjzZcIKSL/exec"
  );
  const [cusName, setCusName] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [pointInput, setPointInput] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pointDialogVisible, setPointDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tempPoint, setTempPoint] = useState(0);
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/projects/sweetienails/login";
      return;
    }
    readData();
  }, []);
  const addData = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event) {
      event.preventDefault(); // Prevent default form submission behavior if event is defined
    }
    let newPoint = 0;
    const foundUserIndex = customers.findIndex((user) => {
      return user.Phone.toString() === phoneInput;
    });
    if (foundUserIndex !== -1) {
      // If the user is found, update their point value
      const updatedUserData = [...customers];
      newPoint = parseInt(updatedUserData[foundUserIndex].Point) + 10;
      setTempPoint(newPoint);
    }
    const obj = { Name: nameInput, Phone: phoneInput, Point: 10 };
    // Regular expression to validate 10-digit phone number
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phoneInput)) {
      alert("Please enter digit phone number");
      setPhoneInput("");
    } else if (foundUserIndex === -1) {
      fetch(api, {
        method: "POST",
        body: JSON.stringify(obj),
      })
        .then((res) => res.text())
        .then((data) => {
          setDialogVisible(true);
          setNameInput("");
          setPhoneInput("");
          readData();
        });
    } else {
      fetch(
        `${api}?update=true&id=${
          foundUserIndex + 2
        }&name=${nameInput}&phone=${phoneInput}&point=${newPoint}`
      )
        .then((res) => res.text())
        .then((data) => {
          setPointDialogVisible(true);
          setNameInput("");
          setPhoneInput("");
          readData();
        });
    }
    console.log("temp:" + newPoint);
  };

  const readData = () => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setCusName(data.Name || []);
        const customersData = data.Name.map((cus: any[]) => ({
          id: cus[0],
          Name: cus[1],
          Phone: cus[2],
          Point: cus[3],
        }));
        setCustomers(customersData);
      });
  };

  const delData = (id: number) => {
    fetch(`${api}?del=true&id=${id}`)
      .then((res) => res.text())
      .then((data) => {
        readData();
        setDialogVisible(true);
      });
  };
  const nameEditor = (options: ColumnEditorOptions) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update the input value
      const newValue = e.target.value;
      options.editorCallback!(newValue); // Call the editor callback with the new value
    };
    const handleNameBlur = () => {
      // Update the nameEdit state when the user finishes editing
      setNameEdit(options.value);
    };
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
      />
    );
  };
  const phoneEditor = (options: ColumnEditorOptions) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update the input value
      const newValue = e.target.value;
      options.editorCallback!(newValue); // Call the editor callback with the new value
    };
    const handleNameBlur = () => {
      // Update the nameEdit state when the user finishes editing
      setPhoneEdit(options.value);
    };
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
      />
    );
  };
  // Update the onRowEditComplete function to use the nameEdit and phoneEdit states
  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const matchingcusloyee = customers.find((cus) => cus.id === e.data.id);
    if (matchingcusloyee) {
      const { Name: cusName, Phone: cusPhone } = matchingcusloyee;
      if (nameEdit === "" && phoneEdit !== "") {
        fetch(
          `${api}?update=true&id=${e.data.id}&name=${cusName}&phone=${phoneEdit}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      } else if (nameEdit !== "" && phoneEdit === "") {
        fetch(
          `${api}?update=true&id=${e.data.id}&name=${nameEdit}&phone=${cusPhone}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      } else {
        fetch(
          `${api}?update=true&id=${e.data.id}&name=${nameEdit}&phone=${phoneEdit}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      }
    } else {
      console.error("Cannot update data: id is null");
    }
  };

  const SuccessDialog = () => {
    return (
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header="Success"
        footer={
          <Button
            onClick={() => {
              setDialogVisible(false);
              setVisible(false);
            }}
            label="OK"
          />
        }
      >
        <div>Data submitted successfully!</div>
      </Dialog>
    );
  };

  const PointDialog = () => {
    return (
      <Dialog
        visible={pointDialogVisible}
        onHide={() => setPointDialogVisible(false)}
        header="Success"
        footer={
          <Button
            onClick={() => {
              setPointDialogVisible(false);
              setVisible(false);
            }}
            label="OK"
          />
        }
      >
        <div>
          You are having {tempPoint} points.
          {tempPoint === 100 ? (
            <div>Congratulations! You have enough points to get 20% off.</div>
          ) : (
            <div>You need {100 - tempPoint} more points to get 20% off.</div>
          )}
        </div>
      </Dialog>
    );
  };

  const header = (
    <form>
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        onClick={(event) => {
          event.preventDefault(); // Prevent default form submission behavior
          setVisible(true); // Show the dialog
        }}
      />
      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <p>
          <span>Customer Name: </span>
          <InputText
            name="Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </p>
        <p>
          <span>Customer Phone: </span>
          <InputText
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            name="Phone"
          />
        </p>
        <p>
          <Button
            label="Add"
            icon="pi pi-plus"
            severity="success"
            onClick={addData}
          />
        </p>
      </Dialog>
    </form>
  );
  return (
    <div>
      <MenuSideBar />
      <div className="main">
        <Card>
          <DataTable
            header={header}
            value={customers}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            stripedRows
          >
            <Column field="Name" header="Name" editor={nameEditor}></Column>
            <Column field="Phone" header="Phone" editor={phoneEditor}></Column>
            <Column field="Point" header="Point" editor={phoneEditor}></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
            <Column
              body={(rowData) => (
                <>
                  <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => delData(rowData.id)}
                  />
                </>
              )}
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </DataTable>
        </Card>
        <SuccessDialog />
        <PointDialog />
      </div>
    </div>
  );
}

export default CustomerInfo;
