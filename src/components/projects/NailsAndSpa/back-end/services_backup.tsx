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
import "@/src/styles/projects/NailsAndSpa/main.css";

interface Service {
  id: number;
  Services: string;
  Prices: string;
}
function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [api] = useState(
    'https://script.google.com/macros/s/AKfycbwH5zB8u9KF-d__2BvF4W55nGUXVaSSnNsMejQolwZ6hSA9cdSvehbHaXEWBuQtbIqO/exec'
  );
  const [serName, setSerName] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [nameEdit, setNameEdit] = useState('');
  const [priceEdit, setPriceEdit] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);

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
        body: JSON.stringify(obj),
      })
        .then((res) => res.text())
        .then((data) => {
          setDialogVisible(true);
          setVisible(true);
          setNameInput('');
          setPriceInput('');
          readData();
        });
    }
  };

  const readData = () => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setSerName(data.Name || []);
        const servicesData = data.Services.map((ser: any[]) => ({
          id: ser[0],
          Services: ser[1],
          Prices: ser[2],
        }));
        setServices(servicesData);
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
  // Update the onRowEditComplete function to use the nameEdit and priceEdit states
  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const matchingEmployee = services.find((emp) => emp.id === e.data.id);
    if (matchingEmployee) {
      const { Services: serName, Prices: empPhone } = matchingEmployee;
      if (nameEdit === '' && priceEdit !== '') {
        fetch(
          `${api}?update=true&id=${e.data.id}&services=${serName}&prices=${priceEdit}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      } else if (nameEdit !== '' && priceEdit === '') {
        fetch(
          `${api}?update=true&id=${e.data.id}&services=${nameEdit}&prices=${empPhone}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      } else {
        fetch(
          `${api}?update=true&id=${e.data.id}&services=${nameEdit}&prices=${priceEdit}`
        )
          .then((res) => res.text())
          .then((data) => {
            setDialogVisible(true);
            readData();
          });
      }
    } else {
      console.error('Cannot update data: id is null');
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
      setPriceInput('');
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
