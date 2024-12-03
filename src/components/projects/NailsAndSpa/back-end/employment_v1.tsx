/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* https://script.google.com/macros/s/AKfycbwjXpUulwpzwccl9Ke2R21TVD10aBM8REDKY_5L53T8IBUXWVTVqLFzg-rLPM1ubFwd/exec */
/* https://script.google.com/macros/s/AKfycbyNM06504rNvkShajfNw6YFTPeavRgDphMCyrkwmwTYCn2uY5hpbyuSwf_ve_Vq_0_l/exec */
import React, { useState, useEffect } from "react";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import MenuSideBar from "@/src/components/projects/NailsAndSpa/back-end/menuSideBar";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

interface Employee {
  id: number;
  Name: string;
  Phone: string;
}
function Employment() {
  const token = Cookies.get("token");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [api] = useState(
    "https://nailsandspa-e594ee8666f0.herokuapp.com/api/data/employment"
  );
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/projects/sweetienails/login";
      return;
    }
    readData();
  }, []);

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
        const employeesData = data.slice(0).map((row: any[]) => {
          return {
            id: row[0],
            Name: row[1],
            Phone: row[2],
          };
        });
        setEmployees(employeesData);
      })
      .catch((error) => {
        console.error("Error fetching or processing data:", error);
        // Handle error (e.g., display an error message to the user)
      });
  };

  const addData = () => {
    const obj = { Name: nameInput, Phone: phoneInput };

    // Regular expression to validate 10-digit phone number
    const phoneRegex = /^\d+$/;

    if (!phoneRegex.test(phoneInput)) {
      alert("Please enter a valid phone number");
      return;
    }

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
      })
      .catch((error) => {
        console.error("Error adding data:", error);
        // Handle error (e.g., display an error message to the user)
      });
  };

  const delData = (id: any) => {
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
  const updateData = (id: any, newName: any, newPhone: any) => {
    fetch(`${api}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: newName, Phone: newPhone }),
    })
      .then((res) => {
        if (res.ok) {
          // Data updated successfully
          console.log("Data updated successfully");
          readData(); // Refresh the data after update
          setNameEdit("");
          setPhoneEdit("");
        } else {
          // Error updating data
          console.error("Error updating data");
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  // Update the onRowEditComplete function to use the nameEdit and phoneEdit states
  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const matchingEmployee = employees.find((emp) => emp.id === e.data.id);
    if (matchingEmployee) {
      const { Name: empName, Phone: empPhone } = matchingEmployee;
      // Determine the values to update
      const updatedName = nameEdit !== "" ? nameEdit : empName;
      const updatedPhone = phoneEdit !== "" ? phoneEdit : empPhone;
      // Call updateData with the determined values
      updateData(e.data.id, updatedName, updatedPhone);
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
        header="Services:"
        visible={visible}
        style={{ width: "30vw" }}
        breakpoints={{ "960px": "75vw", "641px": "80vw" }}
        onHide={() => setVisible(false)}
      >
        <p>
          <span>Employer Name: </span>
          <InputText
            name="Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </p>
        <p>
          <span>Employer Phone: </span>
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
            value={employees}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            stripedRows
          >
            <Column field="Name" header="Name" editor={nameEditor}></Column>
            <Column field="Phone" header="Phone" editor={phoneEditor}></Column>
            <Column
              rowEditor
              className="button-container"
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "right"}}
            />
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
          <SuccessDialog />
        </Card>
      </div>
    </div>
  );
}

export default Employment;
