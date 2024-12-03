/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
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
    "https://nailsandspa-e594ee8666f0.herokuapp.com/api/data/customer"
  );
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [pointEdit, setPointEdit] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pointDialogVisible, setPointDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tempPoint, setTempPoint] = useState(0);
  const token = Cookies.get("token");

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
    console.log('customers ', customers);
    if (foundUserIndex !== -1) {
      // If the user is found, update their point value
      newPoint = parseInt(customers[foundUserIndex].Point) + 10;
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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to add data");
          }
          return res.json();
        })
        .then((data) => {
          setNameInput("");
          setPhoneInput("");
          setDialogVisible(true);
        });
    } else {
      let name = customers[foundUserIndex].Name;
      let phone = customers[foundUserIndex].Phone;
      const obj = { Name: name, Phone: phone, Point: newPoint };
      fetch(`${api}/${foundUserIndex + 1}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((res) => res.text())
        .then((data) => {
          setNameInput("");
          setPhoneInput("");
          setPointDialogVisible(true);
        });
    }
  };
  

  
  const readData = () => {
    fetch(api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        // Extract column headers from the first row
        const headers = data[0];
        // Parse data rows starting from the second row
        const customerData = data.slice(0).map((row: any[]) => {
          return {
            id: row[0],
            Name: row[1],
            Phone: row[2],
            Point: row[3],
          };
        });
        setCustomers(customerData);
      })
      .catch((error) => {
        console.error("Error fetching or processing data:", error);
        // Handle error (e.g., display an error message to the user)
      });
  };

  const delData = (id: number) => {
    fetch(`${api}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          readData(); // Refresh the data after deletion
        } else {
          // Error deleting data
          console.error("Error deleting data");
          readData();
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
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
  const pointEditor = (options: ColumnEditorOptions) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update the input value
      const newValue = e.target.value;
      options.editorCallback!(newValue); // Call the editor callback with the new value
    };
    const handleNameBlur = () => {
      // Update the nameEdit state when the user finishes editing
      setPointEdit(options.value);
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
  const updateData = (id: any, newName: any, newPhone: any, newPoint: any) => {
    
    console.log("newName, newPhone, newPoint", newName, newPhone, newPoint);
    fetch(`${api}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: newName, Phone: newPhone, Point: newPoint }),
    })
      .then((res) => {
        if (res.ok) {
          // Data updated successfully
          readData(); // Refresh the data after update
          setNameEdit("");
          setPhoneEdit("");
          setPointEdit("");
        } else {
          // Error updating data
          console.error("Error updating data");
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const matchingCustomer = customers.find((cus) => cus.id === e.data.id);
    if (matchingCustomer) {
      const { Name: cusName, Phone: cusPhone, Point: cusPoint } = matchingCustomer;
      // Determine the values to update
      const updatedName = nameEdit !== "" ? nameEdit : cusName;
      const updatedPhone = phoneEdit !== "" ? phoneEdit : cusPhone;
      const updatedPoint = pointEdit !== "" ? pointEdit : cusPoint;
      updateData(e.data.id, updatedName, updatedPhone, updatedPoint);
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
              readData();
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
            <Column field="Point" header="Point" editor={pointEditor}></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "right" }}
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
              bodyStyle={{ textAlign: "left" }}
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
