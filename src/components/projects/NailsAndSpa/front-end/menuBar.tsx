
import React, { useRef, useState } from 'react'; 
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import '@/src/styles/projects/NailsAndSpa/font-end/main.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function nailsandspa() {
  const locationRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState<string | null>(null);
    const items: MenuItem[] = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            url: '/projects/sweetienails'
        },
        {
            label: 'Services',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'MANICURE',
                    icon: 'pi pi-bolt',
                    url: '/projects/sweetienails/services-and-prices'
                },
                {
                    label: 'PEDICURE',
                    icon: 'pi pi-bolt',
                    url: '/projects/sweetienails/services-and-prices'
                },
                {
                    label: 'CUSTOM NAIL ART',
                    icon: 'pi pi-bolt',
                    url: '/projects/sweetienails/services-and-pricesp'
                },
                {
                    label: 'WAXING',
                    icon: 'pi pi-bolt',
                    url: '/projects/sweetienails/services-and-pricesp'
                },
                {
                    label: 'MASSAGE',
                    icon: 'pi pi-bolt',
                    url: '/projects/sweetienails/services-and-pricesp'
                },
            ]
        },
        {
            label: 'Contact',
            icon: 'pi pi-phone',
            command: () => {
              if (locationRef.current) {
                locationRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }
        },
        {
            label: 'Dash Board',
            icon: 'pi pi-envelope',
            url: '/projects/sweetienails/login'
        }
    ];

    const DashboardButton = () => {
        const router = useRouter(); // Using Next.js router
    
        const handleRedirect = () => {
            router.push('/projects/sweetienails/login'); // Replace with your target URL
        };
    
        return (
            <Button label="Dash-Board" onClick={handleRedirect} />
        );
    };
    
    return (
        <div className="main">
            <Menubar model={items} />
            <nav className='menuBar'>
                <ul>
                    <li><Link href="/projects/sweetienails">Home</Link></li>
                    <li><Link href="/projects/sweetienails/services-and-prices">Services</Link></li>
                </ul>
            </nav>
            <div className="brand">
                <Link href='/projects/sweetienails'><h1>Nails & Spa</h1></Link>
            </div>
            <nav className='menuBar'>
                <ul>
                    <li><Link href="#Contact">Contact</Link></li>
                    <li><Link href="/projects/sweetienails/login">DashBoard</Link></li>
                </ul>
            </nav>
        </div>
    )
}
        