import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "@/src/styles/projects/NailsAndSpa/font-end/booking.css";
import Head from 'next/head';

const employees = [
  { label: "Employee 1", value: "employee1" },
  { label: "Employee 2", value: "employee2" },
  { label: "Employee 3", value: "employee3" },
];

const services = [
  { label: "Service 1", value: "service1" },
  { label: "Service 2", value: "service2" },
  { label: "Service 3", value: "service3" },
];

// Generate times from 9:00 AM to 6:00 PM in 30-minute intervals
const generateTimeOptions = () => {
  const times = [];
  let hour = 9;
  let minute = 0;

  while (hour < 18) {
    const formattedTime = `${hour}h${minute === 0 ? "" : "30"}`;
    times.push({ label: formattedTime, value: formattedTime });
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const BookingPage = () => {
  const [date, setDate] = useState<Nullable<Date>>(new Date());
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    employee: employees[0] || null, // Default to first employee or null
    service: services[0] || null, // Default to first service or null
    time: timeOptions[0] || "", // Default to first time option or empty string
  });  

  // State for dialog visibility
  const [showDialog, setShowDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (e: any, name: string) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const [errors, setErrors] = useState({
    customerName: "",
    phone: "",
    email: "",
    employee: "",
    service: "",
    time: "",
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Reset errors before validation
    setErrors({
      customerName: "",
      phone: "",
      email: "",
      employee: "",
      service: "",
      time: "",
    });
  
    let hasError = false;
  
    // Basic validation
    if (!formData.customerName) {
      setErrors((prev) => ({ ...prev, customerName: "Customer name is required" }));
      hasError = true;
    }
    if (!formData.phone) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
      hasError = true;
    }
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }
    if (!formData.employee) {
      setErrors((prev) => ({ ...prev, employee: "Please select an employee" }));
      hasError = true;
    }
    if (!formData.service) {
      setErrors((prev) => ({ ...prev, service: "Please select a service" }));
      hasError = true;
    }
    if (!formData.time) {
      setErrors((prev) => ({ ...prev, time: "Please select a time" }));
      hasError = true;
    }
  
    // Validate phone number format
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number" }));
      hasError = true;
    }
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      hasError = true;
    }
  
    if (hasError) return; // Prevent form submission if any field is invalid
  
    try {
      const response = await fetch("https://admin.tonyinthewild.ca/api/twillo-handler.php/sendSmsConfirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    
      if (response.ok) {
        console.log("Booking confirmation sent via SMS!");
        setShowDialog(true); // Show the confirmation dialog
      } else {
        const errorResponse = await response.json();
        console.error("Failed to send booking confirmation via SMS:", errorResponse);
        alert(`Error: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the booking confirmation.");
    }    
  };
   

  const handleBookAnother = () => {
    // Reset the form data for another booking
    setFormData({
      customerName: "",
      phone: "",
      email: "",
      employee: employees[0],
      service: services[0],
      time: timeOptions[0],
    });
    setDate(null); // Clear the selected date as well
    setShowDialog(false); // Close the dialog
  };

  const handleReturnHome = () => {
    setShowDialog(false); // Close the dialog and return home
    // Implement your navigation logic here (e.g., redirect to the homepage)
  };

  return (
  <>
    <Head>
      <title>LaCloche Home</title>
      <meta name="description" content="Explore our past projects showcasing premium home décor and design expertise." />
      <meta name="keywords" content="home projects, interior design, LaCloche Home projects" />
    </Head>
    <div className="booking-container">
        {/* Calendar */}
        <div className="calendar">
          <h3>Select a Date</h3>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value instanceof Date ? e.value : null)}
            inline
            showWeek />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="form-container">
          <h3>Booking Details</h3>

          <div>
            <label>Customer Name</label>
            <InputText
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              style={{ width: "100%" }} />
            {errors.customerName && <small className="error">{errors.customerName}</small>}
          </div>

          <div>
            <label>Phone</label>
            <InputMask
              mask="(999) 999-9999"
              name="phone"
              value={formData.phone}
              onChange={(e: any) => handleInputChange(e)}
              placeholder="Enter phone number"
              style={{ width: "100%" }} />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </div>

          <div>
            <label>Email</label>
            <InputText
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              style={{ width: "100%" }} />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div>
            <label>Employee</label>
            <Dropdown
              value={formData.employee}
              options={employees}
              onChange={(e) => handleDropdownChange(e, "employee")}
              placeholder="Select an employee"
              style={{ width: "100%" }} />
            {errors.employee && <small className="error">{errors.employee}</small>}
          </div>

          <div>
            <label>Service</label>
            <Dropdown
              value={formData.service}
              options={services}
              onChange={(e) => handleDropdownChange(e, "service")}
              placeholder="Select a service"
              style={{ width: "100%" }} />
            {errors.service && <small className="error">{errors.service}</small>}
          </div>

          <div>
            <label>Time</label>
            <Dropdown
              value={formData.time}
              options={timeOptions}
              onChange={(e) => handleDropdownChange(e, "time")}
              placeholder="Select a time"
              style={{ width: "100%" }} />
            {errors.time && <small className="error">{errors.time}</small>}
          </div>


          <Button label="Submit" type="submit" />
        </form>

        {/* Dialog for Booking Confirmation */}
        <Dialog
          visible={showDialog}
          onHide={handleCloseDialog}
          header="Booking Successful"
          footer={<div>
            <Button label="Keep Booking" onClick={handleBookAnother} />
            <a href='/projects/sweetienails'><Button label="Return Home" onClick={handleReturnHome} /></a>
          </div>}
        >
          <p>Your appointment has been booked successfully!</p>
          <p>Would you like to book another appointment or return to the home page?</p>
        </Dialog>
      </div>
  </>
  );
};

export default BookingPage;
