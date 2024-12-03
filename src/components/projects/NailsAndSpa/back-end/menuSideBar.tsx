import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";
import '@/src/styles/projects/NailsAndSpa/font-end/custom.css';
import { Sidebar } from 'primereact/sidebar';
import Cookies from 'js-cookie';
import { Button } from 'primereact/button';

export default function MenuSideBar() {
  const toast = useRef(null);
  const [username, setUsername] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const logout = () => {
    // Delete the token from cookies
    Cookies.remove('token');
    // Redirect to the login page or any other page
    window.location.href = '/projects/sweetienails/login'; // Change the path to your login page
  };

  useEffect(() => {
    // Retrieve the username from cookies
    const user = Cookies.get('user') || null;
    setUsername(user);
  }, []);

  const items = [
    {
      label: 'DashBoard',
      items: [
        {
          label: 'Dash Board',
          icon: 'pi pi-home',
          url: '/projects/sweetienails/dashboard',
        },
        {
          label: 'Payment',
          icon: 'pi pi-money-bill',
          url: '/projects/sweetienails/payment',
        },
        {
          label: 'Employments',
          icon: 'pi pi-user',
          url: '/projects/sweetienails/employments',
        },
        {
          label: 'Services',
          icon: 'pi pi-wrench',
          url: '/projects/sweetienails/services',
        },
        {
          label: 'Customers',
          icon: 'pi pi-users',
          url: '/projects/sweetienails/customers',
        },
      ],
    },
    {
      label: 'Reports',
      items: [
        {
          label: 'Reports',
          icon: 'pi pi-spin pi-spinner',
          url: '/projects/sweetienails/reports',
        },
        { label: 'Logout', icon: 'pi pi-sign-out', command: logout },
      ],
    },
  ];

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <div
        className="flex"
        style={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          background: '#f9fafb',
        }}
      >
        <Button
          icon="pi pi-bars"
          onClick={toggleSidebar}
          style={{
            background: 'none',
            color: 'black',
            border: '1px solid black',
          }}
        />
        <div className="brand" style={{ margin: '0 auto' }}>
          <a href='/projects/sweetienails/dashboard'><h1>Nails & Spa</h1></a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {username ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                alt={username}
                src={`/images/my-profile/1.png`}
                width="45"
                height="40"
                style={{
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginLeft: '15%',
                }}
              />
              <span style={{ marginLeft: '10px' }}>{username}</span>
            </div>
          ) : (
            <span className="greeting">Hello</span>
          )}
        </div>
      </div>

      <Sidebar
        style={{ width: 'auto' }}
        visible={showSidebar}
        onHide={() => setShowSidebar(false)}
      >
        <Menu model={items} />
      </Sidebar>
    </>
  );
}
