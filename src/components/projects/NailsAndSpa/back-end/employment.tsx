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
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import MenuSideBar from "@/src/components/projects/NailsAndSpa/back-end/menuSideBar";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Dialog } from "primereact/dialog";

interface Employee {
  id: number;
  Name: string;
  Phone: string;
}
function Employment() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [api] = useState(
    "https://script.google.com/macros/s/AKfycbwjXpUulwpzwccl9Ke2R21TVD10aBM8REDKY_5L53T8IBUXWVTVqLFzg-rLPM1ubFwd/exec"
  );
  const [empName, setEmpName] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    readData();
  }, []);

  const addData = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event) {
      event.preventDefault(); // Prevent default form submission behavior if event is defined
    }
    const obj = { Name: nameInput, Phone: phoneInput };

    // Regular expression to validate 10-digit phone number
    const phoneRegex = /^\d+$/;

    if (!phoneRegex.test(phoneInput)) {
      alert("Please enter digit phone number");
      setPhoneInput("");
    } else {
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
    }
  };

  const readData = () => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setEmpName(data.Name || []);
        const employeesData = data.Name.map((emp: any[]) => ({
          id: emp[0],
          Name: emp[1],
          Phone: emp[2],
        }));
        setEmployees(employeesData);
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
    const matchingEmployee = employees.find((emp) => emp.id === e.data.id);
    if (matchingEmployee) {
      const { Name: empName, Phone: empPhone } = matchingEmployee;
      if (nameEdit === "" && phoneEdit !== "") {
        fetch(
          `${api}?update=true&id=${e.data.id}&name=${empName}&phone=${phoneEdit}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      } else if (nameEdit !== "" && phoneEdit === "") {
        fetch(
          `${api}?update=true&id=${e.data.id}&name=${nameEdit}&phone=${empPhone}`
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent input if it's not a number
    const numbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (!numbers.includes(parseInt(e.key))) {
      setDialogVisible(true);
      setPhoneInput("");
    }
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
        style={{ width: "50vw" }}
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
      <Splitter style={{ height: "100vh" }}>
        <SplitterPanel className="panel-left" size={10}>
          <MenuSideBar />
        </SplitterPanel>
        <SplitterPanel className="panel-right" size={90}>
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
              <Column
                field="Phone"
                header="Phone"
                editor={phoneEditor}
              ></Column>
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
        </SplitterPanel>
      </Splitter>
    </div>
  );
}

export default Employment;
