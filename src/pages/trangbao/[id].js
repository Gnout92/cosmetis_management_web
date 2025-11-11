import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/trangbao.module.css";
import Image from "next/image";

// Icon Component with Modern SVG Icons
const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    cart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17L4 12"/>
      </svg>
    ),
    truck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5H11"/>
        <path d="M3 12H16"/>
        <path d="M3 19H21"/>
        <path d="M18 7L21 4H18L16 7H18Z"/>
        <path d="M8 19H16"/>
        <path d="M13 7H14C16.7614 7 19 9.23858 19 12C19 14.7614 16.7614 17 14 17H13"/>
        <path d="M8 19V15C8 13.8954 8.89543 13 10 13H12"/>
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"/>
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    phone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    messageCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    mail: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    building: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/>
        <path d="M10 6h4"/>
        <path d="M10 10h4"/>
        <path d="M10 14h4"/>
        <path d="M10 18h4"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    trophy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55.47.98.97 1.21C11.56 18.75 12 19.38 12 20v2"/>
        <path d="M14 14.66V17c0 .55-.47.98-.97 1.21C12.44 18.75 12 19.38 12 20v2"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    leaf: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/>
        <path d="M21 10a9 9 0 0 1-9 9"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
        <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/>
      </svg>
    ),
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
    upArrow: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 14 5-5 5 5"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    chevronLeft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    ),
    chip: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="3"/>
        <path d="m9 6 3 3-3 3"/>
        <path d="m15 6-3 3 3 3"/>
        <path d="m9 18 3-3-3-3"/>
        <path d="m15 18-3-3 3-3"/>
      </svg>
    ),
    link: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/>
      </svg>
    ),
    bottle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20"/>
        <path d="m7 6 5-3 5 3-5 3-5-3z"/>
        <path d="M7 6v20"/>
        <path d="M17 6v20"/>
        <path d="m7 6 5 3 5-3"/>
        <path d="M17 6 12 9"/>
        <path d="M12 9v20"/>
      </svg>
    ),
    handshake: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
        <path d="M6 20c0-2.66 5.33-4 8-4s8 1.34 8 4"/>
      </svg>
    ),
    coffee: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v14a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V3Z"/>
        <path d="M16 8h5a3 3 0 0 1 0 6h-5z"/>
        <path d="M7 8l1.5 1.5A4 4 0 0 1 10 12v4"/>
        <path d="M7 8l-1.5 1.5"/>
        <path d="M7 8v10"/>
      </svg>
    ),
    cookies: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="15" r="2"/>
        <circle cx="15" cy="15" r="2"/>
        <circle cx="12" cy="9" r="2"/>
        <path d="M3 3h18"/>
        <path d="M3 21h18"/>
      </svg>
    ),
    sun: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
    lipstick: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22h20"/>
        <path d="M16 2v20l-2 5"/>
        <path d="M8 2v20l-2 5"/>
        <path d="M8 7l-4 10"/>
        <path d="M16 7l4 10"/>
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5h3a2.5 2.5 0 0 1 0 5h-3a2.5 2.5 0 0 0-2.5 2.5V12a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H9.5a2.5 2.5 0 0 0 0-5h3a2.5 2.5 0 0 1 0-5h3a2.5 2.5 0 0 0 2.5-2.5v-1.5a2.5 2.5 0 0 0 0-5V4.5A2.5 2.5 0 0 1 9.5 2Z"/>
      </svg>
    ),
    lightbulb: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21h6"/>
        <path d="M12 17v4"/>
        <circle cx="12" cy="9" r="7"/>
      </svg>
    ),
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    award: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/>
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
      </svg>
    ),
    target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    thumbsUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
    love: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
      </svg>
    ),
    laugh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z"/>
        <path d="M9 11a3 3 0 1 0 0-6"/>
        <path d="M15 11a3 3 0 1 1 0 6"/>
        <path d="M8 9c0-1.66 1.34-3 3-3"/>
        <path d="M16 9c0-1.66-1.34-3-3-3"/>
      </svg>
    ),
    image: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
    ),
    reply: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 17 4 12 9 7"/>
        <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
      </svg>
    ),
    report: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h11l3 3 3-3h4"/>
        <path d="M18 9V4h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/>
      </svg>
    ),
    trending: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    badge: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/>
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    business: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    trending: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    rocket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.5-2 4.5-2 4.5s3-0.5 4.5-2c0.71-0.71.83-1.58 0-2l-2-2"/>
        <path d="M12 15l-3 3a22.22 22.22 0 0 1-11-11l2-2"/>
        <path d="m7 7 7 7"/>
        <path d="M3 3l18 0"/>
      </svg>
    ),
    chefHat: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z"/>
        <path d="M8 7V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
        <circle cx="12" cy="12" r="1"/>
      </svg>
    ),
    spade: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C10 2 8 3 8 5c0 1.5 1 3 2 4.5 1-1.5 2-3 2-4.5 0-2-2-3-4-3s-4 1-4 3c0 1.5 1 3 2 4.5 1-1.5 2-3 2-4.5 0-2-2-3-4-3S0 5 0 5c0 2 2 3 4 3h8z"/>
        <rect x="9" y="16" width="6" height="6"/>
      </svg>
    ),
    heart2: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    confetti: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8l2 4 4-2-2 4"/>
        <path d="M19 8l-2 4-4-2 2 4"/>
        <path d="M12 5l1 4 4 1-4 1-1 4"/>
        <path d="M7 12l3 3 3-3-3-3-3 3"/>
      </svg>
    ),
    sparkle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.5 3L6 9l3-1.5L12 3zM3 12l3 1.5L9 18l-3-1.5L3 12zM21 12l-3-1.5L15 18l3 1.5L21 12z"/>
      </svg>
    ),
    starburst: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4M16 2v4M3 12h4M17 12h4M12 21v4M12 3v4"/>
        <path d="M19.4 15.1l3.2 3.2M1.4 15.1L4.6 18.3M19.4 8.9l3.2-3.2M1.4 8.9L4.6 5.7"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    fire: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    )
  };
  
  return icons[name] || icons.info;
};

// L'Oréal Men Expert Product Data
const lorealProducts = [
  {
    id: 1,
    name: "Hydra Energetic Gel Rửa Mặt",
    category: "Gel rửa mặt",
    price: "85.000",
    originalPrice: "95.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Gel+Rửa+Mặt",
    description: "Làm sạch sâu và tăng cường năng lượng cho da",
    features: ["Caffeine tự nhiên", "Vitamin C", "Tẩy trang tự nhiên"],
    rating: 4.8,
    reviews: 1247,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Men Expert Carbon Boost Kem Dưỡng",
    category: "Kem dưỡng",
    price: "125.000",
    originalPrice: "140.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Kem+Dưỡng",
    description: "Dưỡng ẩm 24h với công nghệ Carbon Black",
    features: ["Carbon Black", "Vitamin C", "Bảo vệ chống nắng SPF 15"],
    rating: 4.9,
    reviews: 2156,
    badge: "New"
  },
  {
    id: 3,
    name: "Revitalift Laser X3 Kem Mắt",
    category: "Kem mắt",
    price: "175.000",
    originalPrice: "195.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Kem+Mắt",
    description: "Giảm quầng thâm và nếp nhăn quanh mắt",
    features: ["X3 Laser X3", "Retinol", "Caffeine"],
    rating: 4.7,
    reviews: 892,
    badge: "Hot"
  },
  {
    id: 4,
    name: "Men Expert Shower Gel Tươi Tỉnh",
    category: "Sữa tắm",
    price: "75.000",
    originalPrice: "85.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Sữa+Tắm",
    description: "Làm sạch và tươi tỉnh cho cơ thể",
    features: ["Menthol tự nhiên", "Vitamin C", "Dưỡng ẩm 24h"],
    rating: 4.6,
    reviews: 1534,
    badge: ""
  },
  {
    id: 5,
    name: "Hydra Energetic Kem Dưỡng Ngày",
    category: "Kem dưỡng",
    price: "135.000",
    originalPrice: "150.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Kem+Ngày",
    description: "Bảo vệ và dưỡng ẩm cho da ban ngày",
    features: ["SPF 15", "Vitamin C", "Caffeine"],
    rating: 4.8,
    reviews: 1876,
    badge: "Best Seller"
  },
  {
    id: 6,
    name: "Men Expert No Comfort Kem Chống Nắng",
    category: "Chống nắng",
    price: "95.000",
    originalPrice: "105.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Chống+Nắng",
    description: "Bảo vệ da khỏi tia UV không gây khó chịu",
    features: ["SPF 50+", "Kháng nước", "Không trắng xệ"],
    rating: 4.5,
    reviews: 723,
    badge: ""
  },
  {
    id: 7,
    name: "Revitalift Night Cream Kem Ban Đêm",
    category: "Kem dưỡng",
    price: "155.000",
    originalPrice: "175.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Kem+Đêm",
    description: "Phục hồi da trong khi ngủ",
    features: ["Retinol", "Vitamin C", "Hyaluronic Acid"],
    rating: 4.9,
    reviews: 1456,
    badge: "Premium"
  },
  {
    id: 8,
    name: "Hydra Energetic Serum Tăng Cường",
    category: "Serum",
    price: "195.000",
    originalPrice: "220.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Serum",
    description: "Tăng cường năng lượng và tươi trẻ cho da",
    features: ["Caffeine", "Vitamin C", "Biotin"],
    rating: 4.8,
    reviews: 967,
    badge: "New"
  },
  {
    id: 9,
    name: "Men Expert Age Perfect Kem Dưỡng Tuổi",
    category: "Kem dưỡng",
    price: "185.000",
    originalPrice: "210.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Age+Perfect",
    description: "Chống lão hóa cho da tuổi trung niên",
    features: ["Resveratrol", "Vitamin C", "Pro-Retinol"],
    rating: 4.7,
    reviews: 1234,
    badge: "Premium"
  },
  {
    id: 10,
    name: "Hydra Energetic Toner Làm Sạch",
    category: "Nước hoa hồng",
    price: "65.000",
    originalPrice: "75.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Toner",
    description: "Làm sạch và cân bằng độ pH cho da",
    features: ["Caffeine", "Salicylic Acid", "Glycerin"],
    rating: 4.6,
    reviews: 756,
    badge: ""
  },
  {
    id: 11,
    name: "Men Expert Bare Skin Tẩy Tế Bào Chết",
    category: "Tẩy tế bào chết",
    price: "75.000",
    originalPrice: "85.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Tẩy+Tế+Bào",
    description: "Làm mới da với hạt scrub tự nhiên",
    features: ["Hạt bamboo", "Salicylic Acid", "Vitamin E"],
    rating: 4.5,
    reviews: 678,
    badge: ""
  },
  {
    id: 12,
    name: "Revitalift Brightening Serum Sáng Da",
    category: "Serum",
    price: "205.000",
    originalPrice: "230.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Brightening",
    description: "Làm sáng và đều màu da hiệu quả",
    features: ["Vitamin C", "Niacinamide", "Azelaic Acid"],
    rating: 4.8,
    reviews: 1089,
    badge: "Best Seller"
  },
  {
    id: 13,
    name: "Men Expert White Present Mặt Nạ",
    category: "Mặt nạ",
    price: "55.000",
    originalPrice: "65.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Mặt+Nạ",
    description: "Mặt nạ dưỡng trắng cho da nam",
    features: ["Hạt bỏa", "Vitamin C", "Arbutin"],
    rating: 4.4,
    reviews: 543,
    badge: ""
  },
  {
    id: 14,
    name: "Hydra Energetic After Shave Dưỡng",
    category: "Sau cạo râu",
    price: "85.000",
    originalPrice: "95.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=After+Shave",
    description: "Làm dịu và dưỡng da sau khi cạo",
    features: ["Menthol", "Aloe Vera", "Panthenol"],
    rating: 4.7,
    reviews: 876,
    badge: "Essential"
  },
  {
    id: 15,
    name: "Men Expert Oil Balm Kem Dưỡng Dầu",
    category: "Kem dưỡng",
    price: "115.000",
    originalPrice: "130.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Oil+Balm",
    description: "Kiểm soát dầu thừa cho da dầu",
    features: ["Kaolin", "Zinc", "BHA"],
    rating: 4.6,
    reviews: 1123,
    badge: "Hot"
  },
  {
    id: 16,
    name: "Revitalift Peptide Kem Trẻ Hóa",
    category: "Kem dưỡng",
    price: "225.000",
    originalPrice: "250.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Peptide",
    description: "Công nghệ peptide trẻ hóa da",
    features: ["Peptides", "Hyaluronic Acid", "Vitamin C"],
    rating: 4.9,
    reviews: 756,
    badge: "Premium"
  },
  {
    id: 17,
    name: "Men Expert Clean Power Gel Rửa Mặt",
    category: "Gel rửa mặt",
    price: "75.000",
    originalPrice: "85.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Clean+Power",
    description: "Làm sạch sâu với công nghệ Power",
    features: ["Charcoal", "Salicylic Acid", "Tea Tree"],
    rating: 4.5,
    reviews: 987,
    badge: "New"
  },
  {
    id: 18,
    name: "Hydra Energetic Lip Balm Son Dưỡng",
    category: "Son dưỡng",
    price: "45.000",
    originalPrice: "55.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Son+Dưỡng",
    description: "Dưỡng môi tươi tỉnh và bảo vệ",
    features: ["SPF 15", "Vitamin E", "Beeswax"],
    rating: 4.4,
    reviews: 432,
    badge: ""
  },
  {
    id: 19,
    name: "Men Expert Body Max Body Wash",
    category: "Sữa tắm",
    price: "85.000",
    originalPrice: "95.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Body+Wash",
    description: "Sữa tắm tăng cường sức mạnh cơ thể",
    features: ["Caffeine", "Creatine", "Arginine"],
    rating: 4.6,
    reviews: 687,
    badge: "Strong"
  },
  {
    id: 20,
    name: "Revitalift Derm Intensives Kem Chuyên Sâu",
    category: "Kem dưỡng",
    price: "175.000",
    originalPrice: "195.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Derm+Intensive",
    description: "Kem dưỡng chuyên sâu cho da tổn thương",
    features: ["Ceramides", "Niacinamide", "Peptides"],
    rating: 4.8,
    reviews: 1098,
    badge: "Medical"
  },
  {
    id: 21,
    name: "Men Expert Night Recovery Kem Phục Hồi",
    category: "Kem dưỡng",
    price: "145.000",
    originalPrice: "165.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Night+Recovery",
    description: "Kem phục hồi da qua đêm",
    features: ["Niacinamide", "Hyaluronic Acid", "Peptides"],
    rating: 4.7,
    reviews: 823,
    badge: "Recovery"
  },
  {
    id: 22,
    name: "Hydra Energetic Eye Care Kem Mắt",
    category: "Kem mắt",
    price: "165.000",
    originalPrice: "185.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Eye+Care",
    description: "Chăm sóc vùng mắt chuyên sâu",
    features: ["Caffeine", "Retinol", "Peptides"],
    rating: 4.8,
    reviews: 934,
    badge: "Essential"
  },
  {
    id: 23,
    name: "Men Expert Anti Fatigue Serum Chống Mệt",
    category: "Serum",
    price: "185.000",
    originalPrice: "210.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Anti+Fatigue",
    description: "Chống mệt mỏi cho da, tăng sức sống",
    features: ["Caffeine", "Ginseng", "Vitamin C"],
    rating: 4.7,
    reviews: 756,
    badge: "Energy"
  },
  {
    id: 24,
    name: "Revitalift Dark Spot Corrector Trị Thâm",
    category: "Trị thâm",
    price: "155.000",
    originalPrice: "175.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Dark+Spot",
    description: "Trị thâm hiệu quả, làm đều màu da",
    features: ["Vitamin C", "Azelaic Acid", "Niacinamide"],
    rating: 4.6,
    reviews: 654,
    badge: "Effective"
  },
  {
    id: 25,
    name: "Men Expert Complete Care Bộ Chăm Sóc",
    category: "Bộ sản phẩm",
    price: "450.000",
    originalPrice: "520.000",
    image: "https://via.placeholder.com/250x250/003d7a/ffffff?text=Complete+Set",
    description: "Bộ sản phẩm chăm sóc toàn diện cho nam",
    features: ["5 sản phẩm", "Lợi ích đa dạng", "Giá ưu đãi"],
    rating: 4.9,
    reviews: 2341,
    badge: "Complete"
  }
];

export default function LorealMenExpert() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search
  const filteredProducts = lorealProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (id) {
      const product = lorealProducts.find(p => p.id === parseInt(id));
      setSelectedProduct(product);
      setActiveSection('product-detail');
    }
  }, [id]);

  // Product categories for filter
  const categories = ['Tất cả', 'Gel rửa mặt', 'Kem dưỡng', 'Serum', 'Kem mắt', 'Chống nắng', 'Sữa tắm', 'Nước hoa hồng', 'Tẩy tế bào chết', 'Mặt nạ', 'Sau cạo râu', 'Son dưỡng', 'Trị thâm', 'Bộ sản phẩm'];

  const handleProductClick = (productId) => {
    router.push(`/loreal?id=${productId}`);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setActiveSection('products');
  };

  // Product Detail View
  if (selectedProduct) {
    return (
      <div className={styles.fullscreenContainer}>
        {/* Header for Product Detail */}
        <nav className={styles.topNavBar}>
          <div className={styles.navContainer}>
            <div className={styles.navLeft}>
              <div className={styles.logo}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/L%27O%C3%A9real_logo.svg/2560px-L%27O%C3%A9real_logo.svg.png" 
                  alt="L'Oréal Men Expert" 
                  className={styles.logoImage}
                />
                <div className={styles.logoText}>
                  <span className={styles.brandName}>L'Oréal Men Expert</span>
                  <span className={styles.brandSlogan}>Thương hiệu số 1 thế giới</span>
                </div>
              </div>
            </div>
            <div className={styles.navRight}>
              <button className={styles.navAction} onClick={handleBackToProducts}>
                ← Quay lại
              </button>
              <button className={styles.ctaButton}>
                <span className={styles.ctaIcon}><Icon name="cart" size={20} /></span>
                Mua ngay
              </button>
            </div>
          </div>
        </nav>

        {/* Product Detail Content */}
        <div className={styles.productDetailContainer}>
          <div className={styles.productDetailGrid}>
            {/* Product Images */}
            <div className={styles.productImagesSection}>
              <div className={styles.mainImageContainer}>
                <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.mainProductImage} />
                {selectedProduct.badge && (
                  <div className={styles.productBadge}>{selectedProduct.badge}</div>
                )}
              </div>
              <div className={styles.thumbnailImages}>
                <img src={selectedProduct.image} alt="Thumbnail 1" className={styles.thumbnail} />
                <img src={selectedProduct.image} alt="Thumbnail 2" className={styles.thumbnail} />
                <img src={selectedProduct.image} alt="Thumbnail 3" className={styles.thumbnail} />
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.productInfoSection}>
              <div className={styles.breadcrumb}>
                <span>Trang chủ</span> {'>'} <span>Sản phẩm</span> {'>'} <span>{selectedProduct.category}</span>
              </div>
              
              <h1 className={styles.productName}>{selectedProduct.name}</h1>
              <p className={styles.productCategory}>{selectedProduct.category}</p>
              
              <div className={styles.productRating}>
                <div className={styles.stars}>
                  {'★'.repeat(5).split('').map((star, i) => (
                    <span 
                      key={i} 
                      className={i < Math.floor(selectedProduct.rating) ? styles.filledStar : styles.emptyStar}
                    >
                      {star}
                    </span>
                  ))}
                </div>
                <span className={styles.ratingText}>
                  {selectedProduct.rating} ({selectedProduct.reviews} đánh giá)
                </span>
              </div>

              <div className={styles.productPrice}>
                <span className={styles.currentPrice}>{selectedProduct.price}₫</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className={styles.originalPrice}>{selectedProduct.originalPrice}₫</span>
                    <span className={styles.discountPercentage}>
                      {Math.round((1 - parseInt(selectedProduct.price.replace('.','')) / parseInt(selectedProduct.originalPrice.replace('.',''))) * 100)}% giảm
                    </span>
                  </>
                )}
              </div>

              <div className={styles.productDescription}>
                <h3>Mô tả sản phẩm</h3>
                <p>{selectedProduct.description}</p>
              </div>

              <div className={styles.productFeatures}>
                <h3>Thành phần nổi bật</h3>
                <ul>
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.featureIcon}><Icon name="check" size={16} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.productActions}>
                <button className={styles.addToCartButton}>
                  <span className={styles.cartIcon}><Icon name="cart" size={20} /></span>
                  Thêm vào giỏ hàng
                </button>
                <button className={styles.buyNowButton}>
                  Mua ngay
                </button>
                <button className={styles.wishlistButton}>
                  <Icon name="heart" size={16} />
                </button>
              </div>

              <div className={styles.productMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}><Icon name="truck" size={20} /></span>
                  <span>Miễn phí vận chuyển cho đơn hàng từ 200.000₫</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}><Icon name="refresh" size={20} /></span>
                  <span>Đổi trả miễn phí trong 30 ngày</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}><Icon name="lock" size={20} /></span>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Website Content
  return (
    <div className={styles.fullscreenContainer}>
      {/* Header */}
      <nav className={styles.topNavBar}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <div className={styles.logo}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/L%27O%C3%A9real_logo.svg/2560px-L%27O%C3%A9real_logo.svg.png" 
                alt="L'Oréal Men Expert" 
                className={styles.logoImage}
              />
              <div className={styles.logoText}>
                <span className={styles.brandName}>L'Oréal Men Expert</span>
                <span className={styles.brandSlogan}>Thương hiệu số 1 thế giới về chăm sóc da nam</span>
              </div>
            </div>
            <div className={styles.mainMenu}>
              <button 
                className={`${styles.menuItem} ${activeSection === 'home' ? styles.active : ''}`}
                onClick={() => setActiveSection('home')}
              >
                🏠 Trang chủ
              </button>
              <button 
                className={`${styles.menuItem} ${activeSection === 'about' ? styles.active : ''}`}
                onClick={() => setActiveSection('about')}
              >
                <Icon name="home" size={20} /> Giới thiệu
              </button>
              <button 
                className={`${styles.menuItem} ${activeSection === 'products' ? styles.active : ''}`}
                onClick={() => setActiveSection('products')}
              >
                <Icon name="package" size={20} /> Sản phẩm
              </button>
              <button 
                className={`${styles.menuItem} ${activeSection === 'stories' ? styles.active : ''}`}
                onClick={() => setActiveSection('stories')}
              >
                📖 Tin tức
              </button>
              <button 
                className={`${styles.menuItem} ${activeSection === 'contact' ? styles.active : ''}`}
                onClick={() => setActiveSection('contact')}
              >
                <Icon name="phone" size={20} /> Liên hệ
              </button>
            </div>
          </div>
          <div className={styles.navCenter}>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.searchBtn}>🔍</button>
            </div>
          </div>
          <div className={styles.navRight}>
            <button className={styles.navAction}>
              <Icon name="bell" size={20} /> <span className={styles.badge}>3</span>
            </button>
            <button className={styles.navAction}>
              <Icon name="messageCircle" size={20} /> <span className={styles.badge}>5</span>
            </button>
            <button className={styles.navAction}>
              <Icon name="messageCircle" size={20} /> <span className={styles.badge}>0</span>
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>👤</div>
              <span>Tài khoản</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      {activeSection === 'home' && (
        <div className={styles.heroBanner}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                L'Oréal Men Expert
              </h1>
              <p className={styles.heroSubtitle}>
                Thương hiệu số 1 thế giới về chăm sóc da nam
              </p>
              <p className={styles.heroDescription}>
                Khám phá bộ sưu tập sản phẩm chăm sóc da chuyên biệt dành riêng cho nam giới, 
                được nghiên cứu và phát triển bởi các chuyên gia hàng đầu thế giới.
              </p>
              <div className={styles.heroActions}>
                <button 
                  className={styles.primaryCTA}
                  onClick={() => setActiveSection('products')}
                >
                  <Icon name="package" size={20} /> Khám phá sản phẩm
                </button>
                <button className={styles.secondaryCTA}>
                  📖 Tìm hiểu thêm
                </button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop" 
                alt="L'Oréal Men Expert Products" 
                className={styles.heroImageContent}
              />
            </div>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Năm kinh nghiệm</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Quốc gia</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>1B+</span>
              <span className={styles.statLabel}>Khách hàng tin dùng</span>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className={styles.aboutSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Về L'Oréal Men Expert</h2>
              <p className={styles.sectionSubtitle}>
                Thương hiệu tiên phong trong lĩnh vực chăm sóc da nam với hơn 50 năm kinh nghiệm
              </p>
            </div>

            <div className={styles.aboutContent}>
              <div className={styles.aboutGrid}>
                <div className={styles.aboutCard}>
                  <Icon name="package" size={20} /> Khám phá sản phẩm
                  <h3>Uy tín thương hiệu</h3>
                  <p>L'Oréal là thương hiệu mỹ phẩm lớn nhất thế giới, được 1 tỷ+ khách hàng tin tưởng trên toàn cầu.</p>
                </div>
                <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}><Icon name="chip" size={32} /></div>
                  <h3>Nghiên cứu khoa học</h3>
                  <p>Hơn 4,000 nhà khoa học và chuyên gia da liễu nghiên cứu phát triển sản phẩm chuyên sâu.</p>
                </div>
                <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}><Icon name="user" size={32} /></div>
                  <h3>Chuyên biệt cho nam</h3>
                  <p>Hiểu rõ nhu cầu chăm sóc da riêng của nam giới, từ da dầu, hỗn hợp đến da khô.</p>
                </div>
                <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}><Icon name="leaf" size={32} /></div>
                  <h3>An toàn & hiệu quả</h3>
                  <p>Công thức được kiểm nghiệm nghiêm ngặt, phù hợp với làn da nam Việt Nam.</p>
                </div>
              </div>

              <div className={styles.aboutAchievements}>
                <h3>Thành tựu nổi bật</h3>
                <div className={styles.achievementsGrid}>
                  <div className={styles.achievement}>
                    <span className={styles.achievementNumber}>#1</span>
                    <span className={styles.achievementText}>Thương hiệu chăm sóc da nam hàng đầu thế giới</span>
                  </div>
                  <div className={styles.achievement}>
                    <span className={styles.achievementNumber}>50+</span>
                    <span className={styles.achievementText}>Quốc gia có mặt trên thế giới</span>
                  </div>
                  <div className={styles.achievement}>
                    <span className={styles.achievementNumber}>25</span>
                    <span className={styles.achievementText}>Dòng sản phẩm chuyên biệt</span>
                  </div>
                  <div className={styles.achievement}>
                    <span className={styles.achievementNumber}>100+</span>
                    <span className={styles.achievementText}>Bằng sáng chế công nghệ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      {activeSection === 'products' && (
        <div className={styles.productsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Danh sách sản phẩm</h2>
              <p className={styles.sectionSubtitle}>
                Khám phá 25 sản phẩm chăm sóc da chuyên biệt dành cho nam
              </p>
            </div>

            {/* Category Filter */}
            <div className={styles.categoryFilter}>
              <div className={styles.filterScroll}>
                {categories.map((category, index) => (
                  <button 
                    key={index}
                    className={styles.filterButton}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                    {product.badge && (
                      <div className={styles.productBadge}>{product.badge}</div>
                    )}
                    <div className={styles.productActions}>
                      <button className={styles.quickViewBtn}><Icon name="eye" size={16} /> Xem nhanh</button>
                      <button className={styles.wishlistBtn}><Icon name="heart" size={16} /></button>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productCategory}>{product.category}</p>
                    <div className={styles.productRating}>
                      <div className={styles.stars}>
                        {'★'.repeat(5).split('').map((star, i) => (
                          <span 
                            key={i} 
                            className={i < Math.floor(product.rating) ? styles.filledStar : styles.emptyStar}
                          >
                            {star}
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingText}>({product.reviews})</span>
                    </div>
                    <div className={styles.productPrice}>
                      <span className={styles.currentPrice}>{product.price}₫</span>
                      {product.originalPrice && (
                        <span className={styles.originalPrice}>{product.originalPrice}₫</span>
                      )}
                    </div>
                    <div className={styles.productFeatures}>
                      {product.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className={styles.featureTag}>{feature}</span>
                      ))}
                    </div>
                    <button className={styles.viewDetailsBtn}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button className={styles.paginationBtn} disabled>← Trước</button>
              <div className={styles.paginationNumbers}>
                <button className={styles.paginationNumber}>1</button>
                <button className={styles.paginationNumber}>2</button>
                <button className={styles.paginationNumber}>3</button>
                <span>...</span>
                <button className={styles.paginationNumber}>10</button>
              </div>
              <button className={styles.paginationBtn}>Sau →</button>
            </div>
          </div>
        </div>
      )}

      {/* Stories Section */}
      {activeSection === 'stories' && (
        <div className={styles.storiesSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Tin tức & Bài viết</h2>
              <p className={styles.sectionSubtitle}>
                Cập nhật xu hướng chăm sóc da nam mới nhất từ chuyên gia
              </p>
            </div>

            <div className={styles.storiesGrid}>
              <article className={styles.storyCard}>
                <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop" alt="Chăm sóc da nam" />
                <div className={styles.storyContent}>
                  <h3>Cách chăm sóc da nam mùa hè hiệu quả</h3>
                  <p>Hướng dẫn chi tiết về routine chăm sóc da phù hợp với khí hậu nhiệt đới...</p>
                  <div className={styles.storyMeta}>
                    <span>5 phút đọc</span>
                    <span>•</span>
                    <span>1.2K lượt xem</span>
                  </div>
                </div>
              </article>

              <article className={styles.storyCard}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop" alt="Trang điểm nam" />
                <div className={styles.storyContent}>
                  <h3>Top 5 sản phẩm chăm sóc da nam bán chạy nhất 2024</h3>
                  <p>Khám phá những sản phẩm được yêu thích nhất của L'Oréal Men Expert...</p>
                  <div className={styles.storyMeta}>
                    <span>3 phút đọc</span>
                    <span>•</span>
                    <span>856 lượt xem</span>
                  </div>
                </div>
              </article>

              <article className={styles.storyCard}>
                <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=250&fit=crop" alt="Grooming nam" />
                <div className={styles.storyContent}>
                  <h3>Lịch sử thương hiệu L'Oréal Men Expert</h3>
                  <p>Hành trình 50+ năm phát triển thành thương hiệu số 1 thế giới...</p>
                  <div className={styles.storyMeta}>
                    <span>7 phút đọc</span>
                    <span>•</span>
                    <span>2.1K lượt xem</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div className={styles.contactSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Liên hệ với chúng tôi</h2>
              <p className={styles.sectionSubtitle}>
                Hỗ trợ khách hàng 24/7 - Có câu trả lời cho mọi thắc mắc của bạn
              </p>
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}><Icon name="phone" size={24} /></div>
                  <h3>Hotline</h3>
                  <p>1900-1234 (miễn phí)</p>
                  <p>Hỗ trợ 24/7</p>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}><Icon name="messageCircle" size={24} /></div>
                  <h3>Chat trực tiếp</h3>
                  <p>Chat với tư vấn viên</p>
                  <p>Phản hồi trong 30 giây</p>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}><Icon name="mail" size={24} /></div>
                  <h3>Email</h3>
                  <p>support@loreal-mexpert.vn</p>
                  <p>Phản hồi trong 2 giờ</p>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}><Icon name="building" size={24} /></div>
                  <h3>Showroom</h3>
                  <p>123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                  <p>Mở cửa 8h-22h hàng ngày</p>
                </div>
              </div>

              <div className={styles.contactForm}>
                <h3>Gửi yêu cầu hỗ trợ</h3>
                <form>
                  <input type="text" placeholder="Họ và tên" />
                  <input type="email" placeholder="Email" />
                  <input type="tel" placeholder="Số điện thoại" />
                  <select>
                    <option>Chọn chủ đề hỗ trợ</option>
                    <option>Tư vấn sản phẩm</option>
                    <option>Hỗ trợ đơn hàng</option>
                    <option>Đổi trả sản phẩm</option>
                    <option>Khác</option>
                  </select>
                  <textarea placeholder="Nội dung yêu cầu" rows="5"></textarea>
                  <button type="submit">Gửi yêu cầu</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail View */}
      {selectedProduct && (
        <div className={styles.productDetailContainer}>
          <div className={styles.productDetailGrid}>
            {/* Product Images */}
            <div className={styles.productImagesSection}>
              <div className={styles.mainImageContainer}>
                <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.mainProductImage} />
                {selectedProduct.badge && (
                  <div className={styles.productBadge}>{selectedProduct.badge}</div>
                )}
              </div>
              <div className={styles.thumbnailImages}>
                <img src={selectedProduct.image} alt="Thumbnail 1" className={styles.thumbnail} />
                <img src={selectedProduct.image} alt="Thumbnail 2" className={styles.thumbnail} />
                <img src={selectedProduct.image} alt="Thumbnail 3" className={styles.thumbnail} />
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.productInfoSection}>
              <div className={styles.breadcrumb}>
                <span>Trang chủ</span> {'>'} <span>Sản phẩm</span> {'>'} <span>{selectedProduct.category}</span>
              </div>
              
              <h1 className={styles.productName}>{selectedProduct.name}</h1>
              <p className={styles.productCategory}>{selectedProduct.category}</p>
              
              <div className={styles.productRating}>
                <div className={styles.stars}>
                  {'★'.repeat(5).split('').map((star, i) => (
                    <span 
                      key={i} 
                      className={i < Math.floor(selectedProduct.rating) ? styles.filledStar : styles.emptyStar}
                    >
                      {star}
                    </span>
                  ))}
                </div>
                <span className={styles.ratingText}>
                  {selectedProduct.rating} ({selectedProduct.reviews} đánh giá)
                </span>
              </div>

              <div className={styles.productPrice}>
                <span className={styles.currentPrice}>{selectedProduct.price}₫</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className={styles.originalPrice}>{selectedProduct.originalPrice}₫</span>
                    <span className={styles.discountPercentage}>
                      {Math.round((1 - parseInt(selectedProduct.price.replace('.','')) / parseInt(selectedProduct.originalPrice.replace('.',''))) * 100)}% giảm
                    </span>
                  </>
                )}
              </div>

              <div className={styles.productDescription}>
                <h3>Mô tả sản phẩm</h3>
                <p>{selectedProduct.description}</p>
              </div>

              <div className={styles.productFeatures}>
                <h3>Thành phần nổi bật</h3>
                <ul>
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.featureIcon}><Icon name="check" size={16} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.productActions}>
                <button className={styles.addToCartButton}>
                  <span className={styles.cartIcon}><Icon name="cart" size={20} /></span>
                  Thêm vào giỏ hàng
                </button>
                <button className={styles.buyNowButton}>
                  Mua ngay
                </button>
                <button className={styles.wishlistButton}>
                  <Icon name="heart" size={16} />
                </button>
              </div>

              <div className={styles.productMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}><Icon name="truck" size={20} /></span>
                  <span>Miễn phí vận chuyển cho đơn hàng từ 200.000₫</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}><Icon name="refresh" size={20} /></span>
                  <span>Đổi trả miễn phí trong 30 ngày</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}><Icon name="lock" size={20} /></span>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/L%27O%C3%A9real_logo.svg/2560px-L%27O%C3%A9real_logo.svg.png" 
                alt="L'Oréal Men Expert" 
                className={styles.footerLogo}
              />
              <p className={styles.footerDescription}>
                L'Oréal Men Expert - Thương hiệu số 1 thế giới về chăm sóc da nam. 
                Chuyên nghiệp, hiệu quả và tin cậy.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}><Icon name="facebook" size={24} /> Facebook</a>
                <a href="#" className={styles.socialLink}><Icon name="instagram" size={24} /> Instagram</a>
                <a href="#" className={styles.socialLink}><Icon name="youtube" size={24} /> YouTube</a>
                <a href="#" className={styles.socialLink}><Icon name="tiktok" size={24} /> TikTok</a>
              </div>
            </div>

            <div className={styles.footerSection}>
              <h4>Sản phẩm</h4>
              <ul>
                <li><a href="#">Gel rửa mặt</a></li>
                <li><a href="#">Kem dưỡng</a></li>
                <li><a href="#">Serum</a></li>
                <li><a href="#">Chống nắng</a></li>
                <li><a href="#">Kem mắt</a></li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Hỗ trợ</h4>
              <ul>
                <li><a href="#">Hướng dẫn sử dụng</a></li>
                <li><a href="#">Chính sách đổi trả</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
                <li><a href="#">Điều khoản sử dụng</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Liên hệ</h4>
              <div className={styles.footerContact}>
                <p><Icon name="phone" size={16} /> 1900-1234</p>
                <p><Icon name="messageCircle" size={16} /> Chat trực tuyến 24/7</p>
                <p><Icon name="mail" size={16} /> support@loreal-mexpert.vn</p>
                <p><Icon name="building" size={16} /> 123 Nguyễn Huệ, Q.1, TP.HCM</p>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2024 L'Oréal Men Expert Vietnam. Tất cả quyền được bảo lưu.</p>
            <p>Được phát triển bởi MiniMax Agent</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className={styles.floatingActions}>
        <button className={styles.floatingBtn} title="Về đầu trang"><Icon name="upArrow" size={20} /></button>
        <button className={styles.floatingBtn} title="Chat hỗ trợ"><Icon name="messageCircle" size={20} /></button>
        <button className={styles.floatingBtn} title="Gọi điện"><Icon name="phone" size={20} /></button>
      </div>
    </div>
  );
}
        
        {/* Left Mega Sidebar */}
        <aside className={styles.leftMegaSidebar}>
          {/* Shop Profile */}
          <div className={styles.shopProfile}>
            <div className={styles.shopCover}>
              <img src="https://via.placeholder.com/300x120/FFB6C1/000000?text=Beauty+Zone+Cover" alt="Shop Cover" />
            </div>
            <div className={styles.shopInfo}>
              <div className={styles.shopAvatar}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=BZ" alt="Beauty Zone" />
                <div className={styles.verifiedBadge}><Icon name="check" size={12} /></div>
              </div>
              <h3 className={styles.shopName}>Beauty Zone Official Store</h3>
              <p className={styles.shopDescription}>Chuyên cung cấp mỹ phẩm chính hãng từ các thương hiệu nổi tiếng</p>
              <div className={styles.shopMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>25.8K</span>
                  <span className={styles.metricLabel}>Người theo dõi</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>4.9</span>
                  <span className={styles.metricLabel}><Icon name="star" size={16} /> Đánh giá</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>99%</span>
                  <span className={styles.metricLabel}>Phản hồi</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>15K+</span>
                  <span className={styles.metricLabel}>Đơn hàng</span>
                </div>
              </div>
              <div className={styles.shopActions}>
                <button className={styles.followBtn}>+ Theo dõi</button>
                <button className={styles.chatBtn}><Icon name="messageCircle" size={16} /> Chat ngay</button>
              </div>
            </div>
          </div>

          {/* Live Support Panel */}
          <div className={styles.liveSupportPanel}>
            <h4 className={styles.panelTitle}><Icon name="headphones" size={20} /> Hỗ trợ trực tuyến</h4>
            <div className={styles.supportAgents}>
              <div className={styles.agent}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=A1" alt="Agent" />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>Tư vấn viên Linh</span>
                  <span className={styles.agentStatus}>🟢 Đang online</span>
                </div>
                <button className={styles.chatAgentBtn}><Icon name="messageCircle" size={16} /></button>
              </div>
              <div className={styles.agent}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=A2" alt="Agent" />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>Chuyên gia skincare</span>
                  <span className={styles.agentStatus}>🟢 Đang online</span>
                </div>
                <button className={styles.chatAgentBtn}><Icon name="messageCircle" size={16} /></button>
              </div>
              <div className={styles.agent}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=A3" alt="Agent" />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>Hỗ trợ đơn hàng</span>
                  <span className={styles.agentStatus}>🟡 Bận (5 phút)</span>
                </div>
                <button className={styles.chatAgentBtn}><Icon name="messageCircle" size={16} /></button>
              </div>
            </div>
            <button className={styles.callbackBtn}><Icon name="phone" size={16} /> Yêu cầu gọi lại</button>
          </div>

          {/* Quick Categories */}
          <div className={styles.quickCategories}>
            <h4 className={styles.panelTitle}><Icon name="badge" size={20} /> Danh mục nổi bật</h4>
            <div className={styles.categoryGrid}>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon name="bottle" size={20} /></span>
                <span className={styles.categoryName}>Serum</span>
                <span className={styles.categoryCount}>(156)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon name="handshake" size={20} /></span>
                <span className={styles.categoryName}>Kem dưỡng</span>
                <span className={styles.categoryCount}>(89)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon name="chefHat" size={20} /></span>
                <span className={styles.categoryName}>Mặt nạ</span>
                <span className={styles.categoryCount}>(234)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon name="cookies" size={20} /></span>
                <span className={styles.categoryName}>Tẩy trang</span>
                <span className={styles.categoryCount}>(67)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon name="sun" size={20} /></span>
                <span className={styles.categoryName}>Chống nắng</span>
                <span className={styles.categoryCount}>(45)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon name="lipstick" size={20} /></span>
                <span className={styles.categoryName}>Son môi</span>
                <span className={styles.categoryCount}>(123)</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className={styles.trendingTopics}>
            <h4 className={styles.panelTitle}><Icon name="trending" size={20} /> Trending</h4>
            <div className={styles.trendingList}>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>1</span>
                <span className={styles.trendText}>#ViminC_Challenge</span>
                <span className={styles.trendCount}>12.5K posts</span>
              </div>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>2</span>
                <span className={styles.trendText}>#GlowingSkin</span>
                <span className={styles.trendCount}>8.9K posts</span>
              </div>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>3</span>
                <span className={styles.trendText}>#KoreanSkincare</span>
                <span className={styles.trendCount}>6.7K posts</span>
              </div>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>4</span>
                <span className={styles.trendText}>#SerumReview</span>
                <span className={styles.trendCount}>5.2K posts</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContentArea}>
          {/* Post Container */}
          <article className={styles.postContainer}>
            {/* Post Header */}
            <header className={styles.postHeader}>
              <div className={styles.authorSection}>
                <img src="https://via.placeholder.com/60x60/FFB6C1/000000?text=BE" alt="Beauty Expert" className={styles.authorAvatar} />
                <div className={styles.authorDetails}>
                  <h3 className={styles.authorName}>{article.author}</h3>
                  <div className={styles.authorMeta}>
                    <span className={styles.postTime}>{article.date}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.readTime}>{article.readTime}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.visibility}>🌍 Công khai</span>
                  </div>
                </div>
              </div>
              <div className={styles.postActions}>
                <button className={styles.saveBtn}>🔖</button>
                <button className={styles.shareBtn}>📤</button>
                <button className={styles.moreBtn}>⋯</button>
              </div>
            </header>

            {/* Post Content */}
            <div className={styles.postMainContent}>
              <h1 className={styles.postTitle}>{article.title}</h1>
              
              <div className={styles.postMeta}>
                <span className={styles.categoryBadge}>{article.category}</span>
                <div className={styles.tagsList}>
                  {article.tags.map((tag, index) => (
                    <span key={index} className={styles.hashtag}>#{tag}</span>
                  ))}
                </div>
              </div>

              <div className={styles.featuredImage}>
                <img src={article.image} alt={article.title} />
                <div className={styles.imageOverlay}>
                  <button className={styles.expandBtn}>🔍 Xem chi tiết</button>
                </div>
              </div>

              <div className={styles.articleContent}>
                {article.content.map((item, index) => (
                  <div key={index} className={styles.contentBlock}>
                    {item.type === 'intro' && (
                      <p className={styles.introText}>{item.text}</p>
                    )}
                    {item.type === 'heading' && (
                      <h3 className={styles.sectionHeading}>{item.text}</h3>
                    )}
                    {item.type === 'paragraph' && (
                      <p className={styles.paragraphText}>{item.text}</p>
                    )}
                    {item.type === 'list' && (
                      <ul className={styles.benefitsList}>
                        {item.items.map((listItem, idx) => (
                          <li key={idx} className={styles.benefitItem}>
                            <span className={styles.checkmark}><Icon name="check" size={16} /></span>
                            {listItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Content Sections */}
              <div className={styles.additionalSections}>
                <div className={styles.tipsSection}>
                  <h4 className={styles.sectionTitle}><Icon name="lightbulb" size={20} /> Tips chuyên gia</h4>
                  <div className={styles.tipCard}>
                    <p>Để tối ưu hiệu quả của serum Vitamin C, hãy bảo quản ở nơi thoáng mát, tránh ánh sáng trực tiếp.</p>
                  </div>
                </div>

                <div className={styles.warningSection}>
                  <h4 className={styles.sectionTitle}><Icon name="alert" size={20} /> Lưu ý quan trọng</h4>
                  <div className={styles.warningCard}>
                    <p>Da nhạy cảm nên test patch trước khi sử dụng. Ngừng sử dụng nếu có dấu hiệu kích ứng.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Section */}
            <div className={styles.engagementSection}>
              <div className={styles.reactionStats}>
                <div className={styles.reactionCount}>
                  <span className={styles.reactionEmoji}><Icon name="thumbsUp" size={16} /><Icon name="love" size={16} /><Icon name="laugh" size={16} /></span>
                  <span className={styles.countText}>1.2K người đã thích</span>
                </div>
                <div className={styles.commentShareStats}>
                  <span>89 bình luận</span>
                  <span>45 chia sẻ</span>
                </div>
              </div>

              <div className={styles.actionBar}>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}><Icon name="thumbsUp" size={16} /></span>
                  <span className={styles.btnText}>Thích</span>
                </button>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}><Icon name="messageCircle" size={16} /></span>
                  <span className={styles.btnText}>Bình luận</span>
                </button>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}><Icon name="link" size={16} /></span>
                  <span className={styles.btnText}>Chia sẻ</span>
                </button>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}><Icon name="mail" size={16} /></span>
                  <span className={styles.btnText}>Gửi</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <section className={styles.commentsSection}>
              <div className={styles.commentHeader}>
                <h4 className={styles.commentTitle}><Icon name="messageCircle" size={20} /> Bình luận ({article.reviews.length + 12})</h4>
                <select className={styles.sortComments}>
                  <option>Mới nhất</option>
                  <option>Liên quan nhất</option>
                  <option>Cũ nhất</option>
                </select>
              </div>

              <div className={styles.commentComposer}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=U" alt="User" className={styles.composerAvatar} />
                <div className={styles.composerInput}>
                  <textarea placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..." rows="3"></textarea>
                  <div className={styles.composerActions}>
                    <button className={styles.emojiBtn}>😊</button>
                    <button className={styles.imageBtn}><Icon name="image" size={16} /></button>
                    <button className={styles.submitComment}>Bình luận</button>
                  </div>
                </div>
              </div>

              <div className={styles.commentsList}>
                {article.reviews.map((review, index) => (
                  <div key={index} className={styles.commentItem}>
                    <img src="https://via.placeholder.com/45x45/FFB6C1/000000?text=U" alt={review.user} className={styles.commentAvatar} />
                    <div className={styles.commentBody}>
                      <div className={styles.commentBubble}>
                        <div className={styles.commentAuthor}>
                          <span className={styles.commenterName}>{review.user}</span>
                          <span className={styles.commentTime}>{review.date}</span>
                        </div>
                        <div className={styles.ratingInComment}>
                          {Array.from({length: review.rating}, (_, i) => <Icon key={i} name="star" size={14} />)}
                        </div>
                        <p className={styles.commentText}>{review.comment}</p>
                      </div>
                      <div className={styles.commentInteractions}>
                        <button className={styles.likeBtn}>👍 Thích (12)</button>
                        <button className={styles.replyBtn}><Icon name="reply" size={16} /> Trả lời</button>
                        <button className={styles.reportBtn}><Icon name="report" size={16} /> Báo cáo</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show more comments button */}
                <button className={styles.loadMoreComments}>Xem thêm bình luận (12 bình luận nữa)</button>
              </div>
            </section>
          </article>
        </main>

        {/* Right Mega Sidebar */}
        <aside className={styles.rightMegaSidebar}>
          {/* Flash Sale Widget */}
          <div className={styles.flashSaleWidget}>
            <div className={styles.flashSaleHeader}>
              <h4 className={styles.widgetTitle}>⚡ FLASH SALE ⚡</h4>
              <div className={styles.countdown}>
                <span className={styles.countdownLabel}>Kết thúc trong:</span>
                <div className={styles.countdownTimer}>
                  <span className={styles.timeUnit}>02</span>:
                  <span className={styles.timeUnit}>45</span>:
                  <span className={styles.timeUnit}>30</span>
                </div>
              </div>
            </div>
            <div className={styles.flashSaleItems}>
              <div className={styles.saleItem}>
                <img src="/images/banners/56.jpg" alt="Sale Product" />
                <div className={styles.saleInfo}>
                  <h5>Set 5 mặt nạ Premium</h5>
                  <div className={styles.salePrice}>
                    <span className={styles.currentPrice}>149K</span>
                    <span className={styles.originalPrice}>299K</span>
                    <span className={styles.discount}>-50%</span>
                  </div>
                  <div className={styles.saleProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: '65%'}}></div>
                    </div>
                    <span className={styles.soldCount}>Đã bán 65/100</span>
                  </div>
                  <button className={styles.buyNowBtn}>Mua ngay</button>
                </div>
              </div>
            </div>
          </div>

          {/* Hot Products Grid */}
          <div className={styles.hotProductsGrid}>
            <h4 className={styles.widgetTitle}><Icon name="fire" size={20} /> Sản phẩm hot</h4>
            <div className={styles.productGrid}>
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src="https://via.placeholder.com/150x150/FFB6C1/000000?text=P1" alt="Product" />
                  <div className={styles.productBadge}>Best Seller</div>
                </div>
                <div className={styles.productDetails}>
                  <h5 className={styles.productName}>Serum Niacinamide 10%</h5>
                  <div className={styles.productRating}>
                    <span className={styles.stars}><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /></span>
                    <span className={styles.ratingText}>(4.8) • 1.2K reviews</span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>299K</span>
                    <span className={styles.oldPrice}>399K</span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}><Icon name="cart" size={16} /> Thêm vào giỏ</button>
                    <button className={styles.wishlistBtn}><Icon name="heart" size={16} /></button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src="https://via.placeholder.com/150x150/FFB6C1/000000?text=P2" alt="Product" />
                  <div className={styles.productBadge}>New</div>
                </div>
                <div className={styles.productDetails}>
                  <h5 className={styles.productName}>Kem chống nắng SPF 50+</h5>
                  <div className={styles.productRating}>
                    <span className={styles.stars}><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /></span>
                    <span className={styles.ratingText}>(4.9) • 856 reviews</span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>199K</span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}><Icon name="cart" size={16} /> Thêm vào giỏ</button>
                    <button className={styles.wishlistBtn}><Icon name="heart" size={16} /></button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src="https://via.placeholder.com/150x150/FFB6C1/000000?text=P3" alt="Product" />
                  <div className={styles.productBadge}>-25%</div>
                </div>
                <div className={styles.productDetails}>
                  <h5 className={styles.productName}>Mặt nạ Collagen</h5>
                  <div className={styles.productRating}>
                    <span className={styles.stars}><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /><Icon name="star" size={14} /></span>
                    <span className={styles.ratingText}>(4.7) • 642 reviews</span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>89K</span>
                    <span className={styles.oldPrice}>119K</span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}><Icon name="cart" size={16} /> Thêm vào giỏ</button>
                    <button className={styles.wishlistBtn}><Icon name="heart" size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className={styles.relatedArticlesWidget}>
            <h4 className={styles.widgetTitle}>📖 Bài viết liên quan</h4>
            <div className={styles.articlesList}>
              <div className={styles.articleItem}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=A1" alt="Article" />
                <div className={styles.articleInfo}>
                  <h6>10 bước skincare cơ bản cho người mới</h6>
                  <div className={styles.articleMeta}>
                    <span>5 phút đọc</span>
                    <span>•</span>
                    <span>2.5K views</span>
                  </div>
                </div>
              </div>
              <div className={styles.articleItem}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=A2" alt="Article" />
                <div className={styles.articleInfo}>
                  <h6>Cách chọn kem chống nắng phù hợp</h6>
                  <div className={styles.articleMeta}>
                    <span>3 phút đọc</span>
                    <span>•</span>
                    <span>1.8K views</span>
                  </div>
                </div>
              </div>
              <div className={styles.articleItem}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=A3" alt="Article" />
                <div className={styles.articleInfo}>
                  <h6>Review top 5 serum hot nhất 2024</h6>
                  <div className={styles.articleMeta}>
                    <span>7 phút đọc</span>
                    <span>•</span>
                    <span>4.2K views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className={styles.newsletterWidget}>
            <div className={styles.newsletterHeader}>
              <h4 className={styles.widgetTitle}>
                <Icon name="mail" size={20} /> Đăng ký nhận tin
              </h4>
              <p>Nhận thông tin mới nhất về sản phẩm và khuyến mãi!</p>
            </div>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Nhập email của bạn" className={styles.emailInput} />
              <button type="submit" className={styles.subscribeBtn}>Đăng ký ngay</button>
            </form>
            <div className={styles.newsletterBenefits}>
              <div className={styles.benefit}>✅ Tin tức sản phẩm mới</div>
              <div className={styles.benefit}>✅ Ưu đãi độc quyền</div>
              <div className={styles.benefit}>✅ Tips làm đẹp hữu ích</div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className={styles.socialWidget}>
            <h4 className={styles.widgetTitle}>
              <Icon name="starburst" size={20} /> Theo dõi chúng tôi
            </h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}><Icon name="facebook" size={20} /></span>
                <span>Facebook (25K followers)</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}><Icon name="instagram" size={20} /></span>
                <span>Instagram (18K followers)</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}><Icon name="tiktok" size={20} /></span>
                <span>TikTok (12K followers)</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}><Icon name="youtube" size={20} /></span>
                <span>YouTube (8K subscribers)</span>
              </a>
            </div>
          </div>

          {/* Live Chat Widget */}
          <div className={styles.liveChatWidget}>
            <h4 className={styles.widgetTitle}>
              <Icon name="messageCircle" size={20} /> Chat trực tuyến
            </h4>
            <div className={styles.chatPreview}>
              <div className={styles.chatMessage}>
                <span className={styles.supportAgent}>Tư vấn viên:</span>
                <span>Chào bạn! Cần hỗ trợ gì không?</span>
              </div>
            </div>
            <button className={styles.startChatBtn}>Bắt đầu chat ngay</button>
          </div>
        </aside>
      // </div>

      {/* Floating Action Buttons */}
      // <div className={styles.floatingActions}>
      //   <button className={styles.floatingBtn} title="Về đầu trang">
      //     <Icon name="upArrow" size={20} />
      //   </button>
      //   <button className={styles.floatingBtn} title="Chat hỗ trợ">
      //     <Icon name="messageCircle" size={20} />
      //   </button>
      //   <button className={styles.floatingBtn} title="Gọi điện">
      //     <Icon name="phone" size={20} />
      //   </button>
      // </div>
    // </div>
//   );
// }
