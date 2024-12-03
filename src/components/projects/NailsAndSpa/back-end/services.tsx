/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import MenuSideBar from '@/src/components/projects/NailsAndSpa/back-end/menuSideBar';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Dialog } from 'primereact/dialog';
import Cookies from 'js-cookie';
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

interface Service {
  id: number;
  Services: string;
  Prices: string;
}
function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [api] = useState(
    'https://nailsandspa-e594ee8666f0.herokuapp.com/api/data/services'
  );
  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [nameEdit, setNameEdit] = useState('');
  const [priceEdit, setPriceEdit] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      window.location.href = '/projects/sweetienails/login';
      return;
    }
    readData();
  }, []);

  const addData = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event) {
      event.preventDefault(); // Prevent default form submission behavior if event is defined
    }
    const obj = { Services: nameInput, Prices: priceInput };

    // Regular expression to validate 10-digit phone number
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(priceInput)) {
      alert('Please enter digit phone number');
      setPriceInput('');
    } else {
      fetch(api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((res) => res.text())
        .then((data) => {
          setNameInput('');
          setPriceInput('');
          setDialogVisible(true);
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
        const servicesData = data.slice(0).map((row: any[]) => {
          return {
            id: row[0],
            Services: row[1],
            Prices: row[2],
          };
        });
        setServices(servicesData);
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
  const priceEditor = (options: ColumnEditorOptions) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update the input value
      const newValue = e.target.value;
      options.editorCallback!(newValue); // Call the editor callback with the new value
    };
    const handleNameBlur = () => {
      // Update the nameEdit state when the user finishes editing
      setPriceEdit(options.value);
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
  const updateData = (id: any, newService: any, newPrice: any) => {
    fetch(`${api}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Services: newService, Prices: newPrice }),
    })
      .then((res) => {
        if (res.ok) {
          // Data updated successfully
          console.log("Data updated successfully");
          readData(); // Refresh the data after update
          setNameEdit("");
          setPriceEdit("");
        } else {
          // Error updating data
          console.error("Error updating data");
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  // Update the onRowEditComplete function to use the nameEdit and priceEdit states
  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const matchingEmployee = services.find((ser) => ser.id === e.data.id);
    if (matchingEmployee) {
      const { Services: serName, Prices: serPrice } = matchingEmployee;
      // Determine the values to update
      const updatedName = nameEdit !== "" ? nameEdit : serName;
      const updatedPrice = priceEdit !== "" ? priceEdit : serPrice;
      // Call updateData with the determined values
      updateData(e.data.id, updatedName, updatedPrice);
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
        style={{ width: '50vw' }}
        onHide={() => setVisible(false)}
      >
        <p>
          <span>Service Name: </span>
          <InputText
            name="Services"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </p>
        <p>
          <span>Service Price: </span>
          <InputText
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            name="Prices"
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
            value={services}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            stripedRows
          >
            <Column
              field="Services"
              header="Services"
              editor={nameEditor}
            ></Column>
            <Column
              field="Prices"
              header="Prices"
              editor={priceEditor}
            ></Column>
            <Column
              rowEditor
              headerStyle={{ width: '10%', minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'right' }}
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
              headerStyle={{ width: '10%', minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'left' }}
            ></Column>
          </DataTable>
        </Card>
        <SuccessDialog />
      </div>
    </div>
  );
}

export default Services;
