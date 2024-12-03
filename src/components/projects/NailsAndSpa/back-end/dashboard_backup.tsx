/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useRef, FormEvent, useState, useEffect } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import MenuSideBar from '@/src/components/projects/NailsAndSpa/back-end/menuSideBar';
import { InputText } from 'primereact/inputtext';
import '@/src/styles/projects/NailsAndSpa/main.css';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
interface RowData {
  CusName: string;
  Phone: string;
  Services: string;
  Price: number;
  Tip: number;
  Total: number;
  TotalTax: number;
}

interface FormDataObject {
  Date: string;
  CusName: string;
  CusPhone: string;
  Name: string;
  Service: string;
  Total: string;
  Tip: string;
}

interface NotificationProps {
  message: string;
}
// Notification component
function Notification({ message }: NotificationProps) {
  return (
    <div className="notification">
      <b>{message}</b>
    </div>
  );
}
export default function DashBoard() {
  const dataAPI = useRef<HTMLFormElement>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataAPI.current) {
      const formDataArray: FormDataObject[] = [];

      // Iterate over selectedServices and push data to formDataArray
      selectedServices.forEach((service, index) => {
        const employee = selectedEmployees[index];
        const tip = tipByEmp[index]; // Get tip for current employee

        // Append data to FormDataArray if service and employee are not 'None'
        if (service.value !== 'None' && employee !== 'None') {
          formDataArray.push({
            Date: formattedDate,
            CusName: customerName,
            CusPhone: customerPhone,
            Name: employee,
            Service: service.value,
            Total: service.price.toString(),
            Tip: tip,
          });
        }
      });

      // Iterate over formDataArray and send data to API endpoint
      formDataArray.forEach((formData) => {
        const formDataObject = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataObject.append(key, value);
        });

        console.log('Form Data:', formDataObject); // Log form data before sending

        fetch(
          'https://script.google.com/macros/s/AKfycbwX6gFrPFpr7b1XN9ig-unurba_t2EkbKasVmHC1fOefcITy3F7PXAc2ScR9ULf94Nm/exec',
          {
            method: 'POST',
            body: formDataObject,
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log('Response from API:', data); // Log API response
          })
          .catch((error) => {
            console.log('Error:', error); // Log any errors
          });
      });
    }
    setShowNotification(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000); // Refresh after 2 seconds
  };

  // services
  const serviceOptions = [
    { label: 'None', value: 'None', price: 0 },
    { label: 'Manicure', value: 'Manicure', price: 40 },
    { label: 'Pedicure', value: 'Pedicure', price: 50 },
    { label: 'Manicure & Pedicure', value: 'ManicurePedicure', price: 70 },
    { label: 'Nail Art', value: 'NailArt', price: 20 },
    { label: 'Foot Massage', value: 'FootMassage', price: 20 },
    {
      label: 'Nail Removal',
      value: 'NailRemoval',
      price: 15,
    },
    { label: 'Full-set', value: 'FullSet', price: 80 },
    { label: 'Re-fill', value: 'ReFill', price: 55 },
  ];
  // State variables for selected service and its price
  const [selectedServices, setSelectedServices] = useState([
    { value: 'None', price: 0 },
    { value: 'None', price: 0 },
    { value: 'None', price: 0 },
    { value: 'None', price: 0 },
    { value: 'None', price: 0 },
  ]);

  // Update price when user selects a service
  const handleServiceChange = (value: string, index: number) => {
    const newServices = [...selectedServices];
    const selectedOption = serviceOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      newServices[index] = { value: value, price: selectedOption.price };
      setSelectedServices(newServices);
    }
  };

  // employees
  const employeeOptions = [
    { label: 'None', value: 'None' },
    { label: 'Nancy', value: 'Nancy' },
    { label: 'Seven', value: 'Seven' },
    { label: 'Lisa', value: 'Lisa' },
    { label: 'Linh', value: 'Linh' },
    { label: 'Sue', value: 'Sue' },
  ];
  // State variables for selected employees
  const [selectedEmployees, setSelectedEmployees] = useState([
    'None',
    'None',
    'None',
    'None',
    'None',
  ]);
  // Event handler for employee selection change
  const handleEmployeeChange = (index: number, value: string) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index] = value;
    setSelectedEmployees(updatedEmployees);
  };
  // State variables to store customer name and phone number
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tipValue, setTipValue] = useState('');

  // Event handler for input change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name } = e.target;
    // Update state based on input name
    if (name === 'CusName') {
      setCustomerName(e.target.value);
    } else if (name === 'CusPhone') {
      setCustomerPhone(e.target.value);
    } else if (name === 'CusTip') {
      setTipValue(e.target.value);
    }
  };

  // eslint-disable-next-line
  const [valueTotal, setValueTotal] = useState<number | null>(null);

  // Get current date
  const currentDate = new Date();
  // Format the date as needed
  const formattedDate = currentDate.toDateString();

  // Calculate the total price of all selected services
  const [dataTableData, setDataTableData] = useState<RowData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const calcTotal = selectedServices.reduce(
    (acc, service) => acc + parseFloat(service.price.toString()),
    0
  );
  const tipByEmp = selectedServices.map((service) => {
    return Math.floor(
      ((service.price / calcTotal) * 100 * parseFloat(tipValue)) / 100 + 0.5
    ).toString();
  });
  useEffect(() => {
    const calcTotalTax = parseFloat((calcTotal * 1.13).toFixed(2));
    setTotal(calcTotal);
    setTotalTax(calcTotalTax);
    const newData: RowData[] = [];
    selectedServices.forEach((service, index) => {
      if (service.value !== 'None' && selectedEmployees[index] !== 'None') {
        newData.push({
          CusName: customerName,
          Phone: customerPhone,
          Services: service.value,
          Price: service.price,
          Tip: Math.floor(
            ((service.price / calcTotal) * 100 * parseFloat(tipValue)) / 100 +
              0.5
          ),
          Total: calcTotal,
          TotalTax: calcTotalTax,
        });
      }
    });
    setDataTableData(newData);
  }, [
    selectedServices,
    selectedEmployees,
    customerName,
    customerPhone,
    tipValue,
  ]);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totals:"
          colSpan={4}
          footerStyle={{ textAlign: 'right' }}
        />
        <Column footer={`$${total}`} />
      </Row>
      <Row>
        <Column
          footer="Total after Tax:"
          colSpan={4}
          footerStyle={{ textAlign: 'right' }}
        />
        <Column footer={`$${totalTax}`} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="main">
      <Splitter>
        <SplitterPanel className="panel-left" size={10}>
          <MenuSideBar />
        </SplitterPanel>
        <SplitterPanel className="panel-right" size={90}>
          {showNotification && (
            <Notification message="Form submitted successfully!" />
          )}
          <form className="form" ref={dataAPI} onSubmit={handleSubmit}>
            <Card title="Customer Information: " className="CusCard">
              <div className="CusGrid">
                <div className="field">
                  <label>Customer Name:</label>
                  <br />
                  <InputText
                    className="nameInput"
                    value={customerName}
                    onChange={handleInputChange}
                    name="CusName"
                  />
                </div>
                <div className="field">
                  <label>Customer Phone No:</label>
                  <br />
                  <InputText
                    name="CusPhone"
                    value={customerPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label>Tip:</label>
                  <br />
                  <InputText
                    name="CusTip"
                    value={tipValue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Splitter>
                <SplitterPanel className="panel-1">
                  <div className="servicesInfo">
                    {selectedServices.map((service, index) => (
                      <div key={index}>
                        <span>{`Service ${index + 1}: `}</span>
                        <Dropdown
                          value={service.value}
                          onChange={(e) =>
                            handleServiceChange(e.target.value, index)
                          }
                          options={serviceOptions}
                          className="w-full md:w-14rem"
                        />
                      </div>
                    ))}
                  </div>
                </SplitterPanel>

                <SplitterPanel className="panel-2">
                  <div className="employeeInfo">
                    {selectedEmployees.map((selectedEmployee, index) => (
                      <div key={index}>
                        <span>{`Employee ${index + 1}: `}</span>
                        <Dropdown
                          value={selectedEmployee}
                          onChange={(e) =>
                            handleEmployeeChange(index, e.target.value)
                          }
                          options={employeeOptions}
                          className="w-full md:w-14rem"
                        />
                      </div>
                    ))}
                  </div>
                </SplitterPanel>

                <SplitterPanel></SplitterPanel>
              </Splitter>
              <br />
              <DataTable
                value={dataTableData}
                footerColumnGroup={footerGroup}
                showGridlines
                tableStyle={{ minWidth: '40rem' }}
              >
                <Column field="CusName" header="Cus Name" />
                <Column field="Phone" header="Phone" />
                <Column field="Services" header="Services" />
                <Column field="Price" header="Price" />
                <Column field="Tip" header="Tip" />
              </DataTable>
            </Card>
            <>
              {/* Display selected service prices */}
              <div className="servicePrices">
                {selectedServices.map((service, index) => (
                  <div key={index}>
                    {service.value !== 'None' &&
                      selectedEmployees[index] !== 'None' && (
                        <div>
                          <input
                            name="Date"
                            value={formattedDate}
                            style={{ display: 'none' }}
                          />
                          <input
                            name="Name"
                            value={selectedEmployees[index]}
                            style={{ display: 'none' }}
                          />
                          <input
                            name="Service"
                            value={service.value}
                            style={{ display: 'none' }}
                          />
                          <input
                            name="Total"
                            value={service.price}
                            style={{ display: 'none' }}
                          />
                          <input
                            value={tipByEmp}
                            name="Tip"
                            style={{ display: 'none' }}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </>
            <div
              className="button-add"
              style={{ textAlign: 'center', marginTop: '1%' }}
            >
              <Button icon="pi pi-send" label="Submit" severity="warning" />
            </div>
          </form>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
