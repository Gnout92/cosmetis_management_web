import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/trangbao/trangbao1.module.css";

// Modern icon system with enhanced designs
const ModernIcon = ({ name, size = 24, className = "", color = "currentColor" }) => {
  const icons = {
    // Navigation & UI Icons
    FiMenu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiSearch: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    FiHome: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9,22 9,12 15,12 15,22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiFileText: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    // Article & Social Icons
    FiShoppingCart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 6h15l-1.5 9h-12L5 4H2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="20" r="1" fill={color}/>
        <circle cx="18" cy="20" r="1" fill={color}/>
      </svg>
    ),
    FiCheck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiTruck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 8h14l-2 9H7L5 8zM7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="17" r="1" fill={color}/>
        <circle cx="5" cy="17" r="1" fill={color}/>
      </svg>
    ),
    FiPhone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiMessageCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiMail: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiBuilding: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiStar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    FiArrowRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiArrowUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiAward: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiUsers: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiVideo: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiCalendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiInfo: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="8" r="0.5" fill={color} stroke={color} strokeWidth="1"/>
      </svg>
    ),
    FiDroplet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiLayers: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <polygon points="12,2 2,7 12,12 22,7 12,2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="2,17 12,22 22,17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="2,12 12,17 22,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiTrendingDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="17,18 23,18 23,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiActivity: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiTrendingUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="17,6 23,6 23,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiGlobe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    FiCheckCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22,4 12,14.01 9,11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiShield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiSparkles: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5L5 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 7l1.5 4.5L25 13l-4.5 1.5L19 19l-1.5-4.5L13 13l4.5-1.5L19 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiClock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiChevronDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiMapPin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    // Social Media Icons
    FaFacebookF: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    FaInstagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    FaYoutube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 8.75a29 29 0 00.46 5.33A2.78 2.78 0 004.4 16.54C6.12 17 12 17 12 17s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02l5.75-3.27L9.75 8.48v6.54z"/>
      </svg>
    ),
    FaTiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    // Footer Icons
    FiShare2: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M7 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zM1 19h2v-6H1v6zm2 0h2v-6H3v6zm2 0h2v-6H5v6zm2 0h2v-6H7v6zm2 0h2v-6H9v6zm2 0h2v-6H11v6zm2 0h2v-6H13v6zm2 0h2v-6H15v6zm2 0h2v-6H17v6zm2 0h2v-6H19v6z" fill={color}/>
        <path d="M14 4h4a2 2 0 012 2v2l-4-2-4 2V6a2 2 0 012-2z" fill={color}/>
      </svg>
    ),
    FiTag: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiUser: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiThumbsUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiMessageSquare: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    FiSend: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points="22,2 15,22 11,13 2,9 22,2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    // Social Media Icons for sharing
    FaTwitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
      </svg>
    ),
    FaLinkedinIn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2" fill={color}/>
      </svg>
    ),
    FaWhatsapp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    )
  };
  return icons[name] || (
    <svg width={size} height={size} className={className}>
      <circle cx={size/2} cy={size/2} r={size/3} fill={color} />
    </svg>
  );
};

// Stats Counter Component
const StatsCounter = ({ stats }) => {
  const [visibleStats, setVisibleStats] = useState({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          stats.forEach((stat, index) => {
            let current = 0;
            const increment = stat.value / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setVisibleStats(prev => ({
                ...prev,
                [index]: Math.floor(current)
              }));
            }, 30);
          });
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-counter');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [stats, hasAnimated]);

  return (
    <div id="stats-counter" className={styles.statsCounter}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statValue}>
              {visibleStats[index] !== undefined ? visibleStats[index].toLocaleString() : 0}
              {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Parallax Section Component
const ParallaxSection = ({ backgroundImage, pullQuote, className = "" }) => {
  return (
    <div 
      className={`${styles.parallaxSection} ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`
      }}
    >
      <div className={styles.parallaxContent}>
        <blockquote className={styles.parallaxQuote}>
          <ModernIcon name="FiAward" size={32} color="#ffffff" />
          <p className={styles.parallaxQuoteText}>{pullQuote}</p>
        </blockquote>
      </div>
    </div>
  );
};

// Image Grid Component
const ImageGrid = ({ images, className = "" }) => {
  return (
    <div className={`${styles.imageGrid} ${className}`}>
      {images.map((image, index) => (
        <div key={index} className={styles.imageGridItem}>
          <img 
            src={image.src} 
            alt={image.alt}
            className={styles.gridImage}
          />
        </div>
      ))}
    </div>
  );
};

// Product Showcase Component
const ProductShowcase = ({ product }) => {
  return (
    <div className={styles.productShowcase}>
      <div className={styles.productGrid}>
        <div className={styles.productImage}>
          <img 
            src={product.image} 
            alt={product.name}
            className={styles.productImg}
          />
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDescription}>{product.description}</p>
          <ul className={styles.productFeatures}>
            {product.features.map((feature, index) => (
              <li key={index} className={styles.productFeature}>
                <ModernIcon name="FiCheck" size={16} color="#28a745" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Drop Cap Text Component
const DropCapText = ({ text }) => {
  return (
    <div className={styles.dropCapText}>
      <span className={styles.dropCap}>T</span>
      {text.substring(1)}
    </div>
  );
};

// Info Box Component
const InfoBox = ({ title, content, position = "right", className = "" }) => {
  return (
    <aside className={`${styles.infoBox} ${styles[`infoBox${position.charAt(0).toUpperCase() + position.slice(1)}`]} ${className}`}>
      <h3 className={styles.infoBoxTitle}>
        <ModernIcon name="FiShield" size={20} color="#0066cc" />
        {title}
      </h3>
      <ul className={styles.infoBoxList}>
        {content.map((item, itemIndex) => (
          <li key={itemIndex} className={styles.infoBoxItem}>
            <ModernIcon name="FiCheck" size={16} color="#28a745" />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
};

// Highlight Text Component
const HighlightBox = ({ title, items, icon, color = "#0066cc" }) => {
  return (
    <div className={styles.highlightBox} style={{ borderLeftColor: color }}>
      <div className={styles.highlightHeader}>
        <ModernIcon name={icon} size={24} color={color} />
        <h4 className={styles.highlightTitle}>{title}</h4>
      </div>
      <ul className={styles.highlightList}>
        {items.map((item, index) => (
          <li key={index} className={styles.highlightItem}>
            <span className={styles.highlightBullet} style={{ background: color }}>●</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, value, color = "#0066cc" }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 500);
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <div className={styles.progressBar}>
      <div className={styles.progressLabel}>
        <span>{label}</span>
        <span className={styles.progressValue}>{value}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
};

// Timeline Component
const Timeline = ({ items }) => {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineMarker}>
            <div className={styles.timelineDot} />
          </div>
          <div className={styles.timelineContent}>
            <h4 className={styles.timelineTitle}>{item.title}</h4>
            <p className={styles.timelineText}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Featured Quote Component
const FeaturedQuote = ({ text, author, role }) => {
  return (
    <div className={styles.featuredQuote}>
      <div className={styles.quoteMarks}>"</div>
      <p className={styles.featuredQuoteText}>{text}</p>
      <div className={styles.featuredQuoteAuthor}>
        <div className={styles.quoteLine} />
        <div>
          <div className={styles.quoteAuthorName}>{author}</div>
          <div className={styles.quoteAuthorRole}>{role}</div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component  
const StatCard = ({ icon, value, label, color }) => {
  return (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statCardIcon} style={{ background: `${color}15` }}>
        <ModernIcon name={icon} size={28} color={color} />
      </div>
      <div className={styles.statCardValue}>{value}</div>
      <div className={styles.statCardLabel}>{label}</div>
    </div>
  );
};

// Article data structure
const articleData = {
  category: "KHOA HỌC & ĐỜI SỐNG",
  title: "GIẢI MÃ L'ORÉAL MEN EXPERT",
  subtitle: "HÀNH TRÌNH TỪ PHÒNG LAB ĐẾN LÀN DA PHÁI MẠNH",
  deck: "Chúng ta thấy chúng trên kệ hàng mỹ phẩm khắp nơi - những chai lọ, tuýp kem với thiết kế nam tính, màu sắc mạnh mẽ. Nhưng đằng sau mỗi sản phẩm L'Oréal Men Expert là cả một hành trình khoa học kéo dài từ phòng thí nghiệm đến tay người tiêu dùng.",
  author: {
    name: "Chuyên gia Da liễu Nguyễn Văn A",
    title: "Trưởng khoa Da liễu, BV Da liễu Trung ương",
    credentials: [
      "Thành viên Hiệp hội Da liễu Việt Nam",
      "15 năm kinh nghiệm nghiên cứu da nam giới",
      "Tác giả của 23 công trình nghiên cứu quốc tế"
    ]
  },
  publishDate: "11 tháng 11, 2025",
  readTime: "8 phút đọc",
  sections: [
    {
      title: "Dẫn nhập - Tại sao da nam cần chăm sóc đặc biệt?",
      content: `Da nam khác với da nữ ở nhiều khía cạnh quan trọng. Theo nghiên cứu của Đại học Y khoa Harvard, da nam có độ dày trung bình lớn hơn 25% so với da nữ, chứa nhiều collagen hơn và có tuyến bã nhờn hoạt động mạnh hơn 2-3 lần. Tuy nhiên, chính những đặc điểm này lại khiến da nam dễ gặp phải các vấn đề như mụn, dầu thừa và lão hóa sớm nếu không được chăm sóc đúng cách.

L'Oréal Men Expert ra đời từ nhận thức này. Thay vì chỉ đơn thuần thu nhỏ các sản phẩm dành cho nữ, L'Oréal đã đầu tư hàng tỷ euro để nghiên cứu riêng về đặc điểm da nam, từ đó phát triển những công thức độc quyền phù hợp với nhu cầu cụ thể của làn da phái mạnh.`,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=400&fit=crop",
      infoBox: {
        title: "Điều bạn chưa biết về da nam",
        content: [
          "Tiết dầu nhiều hơn 2-3 lần",
          "Dày hơn 25%",
          "Mất collagen nhanh hơn sau 30 tuổi",
          "Hấp thụ dưỡng chất cao hơn 40%"
        ],
        position: "right"
      }
    },
    {
      title: "Nguồn gốc từ phòng thí nghiệm",
      content: `Trung tâm nghiên cứu L'Oréal tại Clichy, Pháp, là nơi khởi nguồn cho tất cả các sản phẩm Men Expert. Đây không chỉ là một phòng thí nghiệm thông thường mà là một hệ sinh thái nghiên cứu toàn diện với 4.000 nhà khoa học từ 50 quốc gia khác nhau.

Tại đây, mỗi ngày có hơn 200 nghiên cứu được tiến hành, từ việc phân tích DNA của tế bào da cho đến việc thử nghiệm các công thức mới trên mô hình da tái tạo 3D. Đặc biệt, L'Oréal sở hữu ngân hàng mô da nam lớn nhất thế giới với hơn 50.000 mẫu da từ các độ tuổi và chủng tộc khác nhau.`,
      pullQuote: "Chúng tôi không chỉ tạo ra sản phẩm, mà tạo ra những giải pháp khoa học thực sự hiệu quả cho làn da nam.",
      stats: [
        { value: 4000, label: "Nhà khoa học" },
        { value: 50000, label: "Mẫu da nam" },
        { value: 200, label: "Nghiên cứu mỗi ngày" },
        { value: 1.3, suffix: " TỶ €", label: "Đầu tư R&D" }
      ]
    },
    {
      title: "Nguồn gốc nguyên liệu",
      content: `Mỗi thành phần trong sản phẩm L'Oréal Men Expert đều trải qua quá trình kiểm định nghiêm ngặt từ nguồn gốc. Công ty đã thiết lập mạng lưới trang trại đối tác tại 12 quốc gia, từ Madagascar với hoa cam Bergamot hữu cơ đến Peru với bơ Shea của người dân bản địa.

Quy trình sản xuất tuân thủ tiêu chuẩn 'From Farm to Face' - từ trang trại đến khuôn mặt. Mỗi nguyên liệu đều có 'hộ chiếu' riêng ghi rõ nơi trồng, phương pháp canh tác, ngày thu hoạch và quá trình chế biến.`,
      images: [
        { src: "https://images.unsplash.com/photo-1563281577-a1be7d1e4610?w=400&h=300&fit=crop", alt: "Hoa cam Bergamot" },
        { src: "https://images.unsplash.com/photo-1518709527010-5d8baa9eb25a?w=400&h=300&fit=crop", alt: "Bơ Shea" },
        { src: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400&h=300&fit=crop", alt: "Hạt cà phê Arabica" }
      ],
      pullQuote: "Chất lượng bắt đầu từ nguồn gốc. Chúng tôi kiểm soát từng bước để đảm bảo mỗi giọt sản phẩm đều đạt tiêu chuẩn cao nhất.",
      infoBox: {
        title: "Nguồn nguyên liệu độc quyền",
        content: [
          "12 trang trại đối tác trên toàn thế giới",
          "100% nguyên liệu có thể truy xuất nguồn gốc",
          "40% cao hơn nồng độ hoạt chất so với chuẩn ngành",
          "Zero carbon footprint trong sản xuất"
        ],
        position: "left"
      }
    },
    {
      title: "Câu chuyện sản phẩm",
      content: `Câu chuyện của dòng Revitalift Laser X3 bắt đầu từ một quan sát đơn giản: nam giới muốn có kết quả nhanh chóng nhưng không muốn bỏ quá nhiều thời gian cho skincare routine. Từ đó, đội ngũ R&D đã mất 3 năm để phát triển công thức 'Anti-Fatigue' độc quyền.

Công thức này kết hợp Pro-Retinol (vitamin A) với Caffeine và hệ peptide, tạo ra hiệu ứng 'laser effect' giảm nếp nhăn trong 7 ngày đầu tiên. Quá trình thử nghiệm lâm sàng được tiến hành trên 2.000 nam giới châu Á trong 6 tháng.`,
      product: {
        name: "Revitalift Laser X3",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=400&fit=crop",
        description: "Công thức 'Anti-Fatigue' độc quyền với Pro-Retinol, Caffeine và hệ peptide",
        features: [
          "3 năm thử nghiệm",
          "2.000 nam giới tham gia",
          "89% cải thiện độ săn chắc trong 7 ngày",
          "92% hài lòng về độ mịn da sau 2 tuần"
        ]
      },
      pullQuote: "Chúng tôi tin rằng mọi nam giới đều xứng đáng có được làn da khỏe mạnh mà không cần tốn quá nhiều thời gian phức tạp."
    },
    {
      title: "Phản hồi từ chuyên gia",
      content: `Bác sĩ da liễu Nguyễn Minh Tuấn, Trưởng khoa Da liễu Bệnh viện Da liễu Trung ương, đã có cơ hội nghiên cứu và đánh giá hiệu quả của các sản phẩm L'Oréal Men Expert trên bệnh nhân trong suốt 2 năm qua.

Theo kết quả nghiên cứu do bác sĩ Tuấn thực hiện trên 200 bệnh nhân nam trong độ tuổi 25-45, các sản phẩm Men Expert cho thấy hiệu quả vượt trội so với các dòng sản phẩm thông thường. Đặc biệt, dòng Hydra Energetic giúp tăng độ ẩm da lên 67% sau 4 tuần sử dụng, trong khi dòng Revitalift giảm 43% độ sâu nếp nhăn sau 8 tuần.`,
      expertImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
      pullQuote: "Hiệu quả của L'Oréal Men Expert được chứng minh không chỉ trong phòng thí nghiệm mà còn trên thực tế lâm sàng với hàng nghìn bệnh nhân.",
      infoBox: {
        title: "Kết quả nghiên cứu lâm sàng",
        content: [
          "200 bệnh nhân tham gia nghiên cứu tại Bệnh viện Da liễu Trung ương",
          "Tăng độ ẩm da 67% sau 4 tuần với Hydra Energetic",
          "Giảm 43% độ sâu nếp nhăn sau 8 tuần với Revitalift",
          "Tỷ lệ hài lòng 91% từ các bác sĩ da liễu"
        ],
        position: "right"
      }
    }
  ],
  conclusion: `Hành trình từ phòng lab đến làn da phái mạnh của L'Oréal Men Expert không chỉ là câu chuyện về một thương hiệu mỹ phẩm, mà là minh chứng cho tầm quan trọng của khoa học trong việc giải quyết các vấn đề cụ thể của từng nhóm đối tượng.

Từ việc thấu hiểu đặc điểm sinh học của da nam, đến việc nghiên cứu và chọn lọc từng thành phần, rồi đến quá trình thử nghiệm lâm sàng nghiêm ngặt - mỗi bước đều thể hiện cam kết của L'Oréal trong việc mang đến những giải pháp khoa học thực sự hiệu quả.

Giá trị của thương hiệu không chỉ nằm ở sản phẩm cuối cùng, mà ở toàn bộ nền tảng khoa học đằng sau nó. Và chính nền tảng này đã giúp L'Oréal Men Expert trở thành thương hiệu chăm sóc da nam số 1 thế giới với doanh thu 2.3 tỷ EUR trong năm 2024.`,
  tags: [
    "L'Oréal Men Expert", 
    "Nguồn gốc sản phẩm", 
    "Khoa học làn da", 
    "Chăm sóc da nam", 
    "Công nghệ da liễu"
  ]
};

const relatedArticles = [
  "Đánh giá chi tiết: Dòng sản phẩm Chống lão hóa của L'Oréal Men Expert hoạt động ra sao?",
  "5 lầm tưởng tai hại khi nam giới chăm sóc da.",
  "Phỏng vấn độc quyền: Giám đốc Sáng tạo L'Oréal và tương lai của ngành mỹ phẩm nam."
];

const authorInfo = {
  name: "Bác sĩ Nguyễn Minh Tuấn",
  role: "Chuyên gia Da liễu",
  experience: "15 năm kinh nghiệm",
  credentials: [
    "Trưởng khoa Da liễu Bệnh viện Da liễu Trung ương",
    "Thành viên Hiệp hội Da liễu Việt Nam",
    "Chuyên gia nghiên cứu đặc điểm da nam giới"
  ]
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
};

export default function TrangBao() {
  const router = useRouter();
  const { id } = router.query;
  const [activeCategory, setActiveCategory] = useState('Trang chủ');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Hàm điều hướng menu
  const handleNavigation = (category, href) => {
    setActiveCategory(category);
    if (href === '/') {
      router.push('/');
    } else {
      // Smooth scroll to top khi chuyển trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Có thể thêm router.push() nếu có trang thực tế
      console.log(`Navigating to: ${category}`);
    }
  };

  return (
    <div className={styles.articleContainer}>
      {/* ========== HEADER - PHẦN ĐẦU TRANG ========== */}
      <header className={styles.siteHeader}>
        {/* Logo & Tiện ích */}
        <div className={styles.headerTop}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>KB</div>
            <div className={styles.logoText}>
              <h1>KHOA HỌC & BÁO CHÍ</h1>
              <p>Tin tức uy tín - Chất lượng hàng đầu</p>
            </div>
          </a>

          <div className={styles.headerUtilities}>
            <div className={styles.searchBar}>
              <input 
                type="text" 
                className={styles.searchInput}
                placeholder="Tìm kiếm bài viết..." 
              />
              <button className={styles.searchButton}>
                <ModernIcon name="FiSearch" size={18} color="white" />
              </button>
            </div>

            <div className={styles.utilityButtons}>
              <button className={styles.utilityButton}>
                <ModernIcon name="FiUser" size={16} />
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        {/* Menu điều hướng chính */}
        <nav className={styles.mainNav}>
          <div className={styles.navContainer}>
            <ul className={styles.navMenu}>
              <li className={styles.navItem}>
                <a 
                  href="/" 
                  className={`${styles.navLink} ${activeCategory === 'Trang chủ' ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('Trang chủ', '/');
                  }}
                >
                  <ModernIcon name="FiHome" size={16} color="currentColor" /> Trang chủ
                </a>
              </li>
              {['Xã hội', 'Kinh tế', 'Thể thao', 'Khoa học', 'Giải trí', 'Công nghệ', 'Đời sống'].map((category) => (
                <li key={category} className={styles.navItem}>
                  <a 
                    href={`/${category.toLowerCase().replace(/ /g, '-')}`} 
                    className={`${styles.navLink} ${activeCategory === category ? styles.active : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(category, `/${category.toLowerCase()}`);
                    }}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Tin nóng ticker - Auto scroll seamless */}
        <div className={styles.breakingNews}>
          <div className={styles.breakingNewsContainer}>
            <span className={styles.breakingTag}>TIN NÓNG</span>
            <div className={styles.breakingContent}>
              <div className={styles.breakingTicker}>
                {/* Duplicate content để tạo hiệu ứng cuộn liền mạch */}
                <span className={styles.breakingItem}>🔴 Phát hiện mới về công nghệ chăm sóc da nam giới</span>
                <span className={styles.breakingItem}>⚡ L'Oréal công bố kết quả nghiên cứu đột phá</span>
                <span className={styles.breakingItem}>📊 Xu hướng skincare nam 2025 đang làm mưa làm gió</span>
                <span className={styles.breakingItem}>🧬 Khoa học da liễu: Bước đột phá mới trong điều trị lão hóa</span>
                <span className={styles.breakingItem}>💡 Công nghệ AI ứng dụng trong chẩn đoán da</span>
                {/* Duplicate để loop seamless */}
                <span className={styles.breakingItem}>🔴 Phát hiện mới về công nghệ chăm sóc da nam giới</span>
                <span className={styles.breakingItem}>⚡ L'Oréal công bố kết quả nghiên cứu đột phá</span>
                <span className={styles.breakingItem}>📊 Xu hướng skincare nam 2025 đang làm mưa làm gió</span>
                <span className={styles.breakingItem}>🧬 Khoa học da liễu: Bước đột phá mới trong điều trị lão hóa</span>
                <span className={styles.breakingItem}>💡 Công nghệ AI ứng dụng trong chẩn đoán da</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs - Điều hướng phân cấp */}
      <div className={styles.breadcrumbs}>
        <div className={styles.breadcrumbsContainer}>
          <a href="/" className={styles.breadcrumbLink}>Trang chủ</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <a href="/khoa-hoc" className={styles.breadcrumbLink}>Khoa học</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <a href="/doi-song" className={styles.breadcrumbLink}>Đời sống</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Giải mã L'Oréal Men Expert</span>
        </div>
      </div>

      {/* ========== BODY - NỘI DUNG TRANG BÀI VIẾT ========== */}
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBackground}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1920&h=1080&fit=crop')`
          }}
        >
          <div className={styles.heroContent}>
            <span className={styles.categoryTag}>KHOA HỌC & ĐỜI SỐNG</span>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine1}>GIẢI MÃ</span>
              <span className={styles.titleLine2}>L'ORÉAL MEN EXPERT</span>
            </h1>
            <h2 className={styles.heroSubtitle}>HÀNH TRÌNH TỪ PHÒNG LAB ĐẾN LÀN DA PHÁI MẠNH</h2>
            <div className={styles.scrollIndicator}>
              <ModernIcon name="FiChevronDown" size={24} color="#ffffff" className={styles.scrollIcon} />
              <span className={styles.scrollText}>Cuộn xuống</span>
            </div>
          </div>
        </div>
      </section>

      {/* Author & Sapo Section */}
      <section className={styles.authorSapoSection}>
        <div className={styles.authorSapoContainer}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <ModernIcon name="FiUsers" size={40} color="#ffffff" />
            </div>
            <div className={styles.authorDetails}>
              <h3 className={styles.authorName}>{articleData.author.name}</h3>
              <p className={styles.authorTitle}>{articleData.author.title}</p>
              <p className={styles.publishMeta}>
                {articleData.publishDate} | {articleData.readTime}
              </p>
            </div>
          </div>
          <div className={styles.sapo}>
            <DropCapText text={articleData.deck} />
          </div>
        </div>
      </section>

      {/* Article Content - VIP PRO VERSION */}
      <main className={styles.articleBody}>
        {articleData.sections.map((section, index) => (
          <article key={index} className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
            </div>
            
            <div className={styles.sectionContent}>
              <p className={styles.sectionText}>{section.content}</p>
            </div>

            {/* Section 0: Thêm Highlight Box cho điểm khác biệt da nam */}
            {index === 0 && (
              <>
                <HighlightBox 
                  title="Đặc điểm nổi bật của da nam"
                  icon="FiShield"
                  color="#e74c3c"
                  items={[
                    "Tiết dầu nhiều hơn 2-3 lần so với da nữ",
                    "Độ dày da lớn hơn 25% giúp chống lão hóa tốt hơn",
                    "Hàm lượng collagen cao nhưng mất nhanh sau 30 tuổi",
                    "Hấp thụ dưỡng chất cao hơn 40% khi được chăm sóc đúng cách"
                  ]}
                />
                <div className={styles.statCardsGrid}>
                  <StatCard icon="FiDroplet" value="3x" label="Tiết dầu cao hơn" color="#3498db" />
                  <StatCard icon="FiLayers" value="+25%" label="Dày hơn" color="#9b59b6" />
                  <StatCard icon="FiTrendingDown" value="30+" label="Tuổi mất collagen" color="#e74c3c" />
                  <StatCard icon="FiActivity" value="+40%" label="Hấp thụ tốt hơn" color="#2ecc71" />
                </div>
              </>
            )}

            {/* Section 1: Thêm Timeline và Stats Counter */}
            {index === 1 && (
              <>
                <StatsCounter stats={section.stats} />
                <FeaturedQuote 
                  text="Chúng tôi không chỉ tạo ra sản phẩm, mà tạo ra những giải pháp khoa học thực sự hiệu quả cho làn da nam giới."
                  author="Dr. Laurent Attal"
                  role="Giám đốc Nghiên cứu L'Oréal Men Expert"
                />
                <Timeline 
                  items={[
                    {
                      title: "Giai đoạn 1: Nghiên cứu cơ bản (6-12 tháng)",
                      text: "Phân tích DNA tế bào da, nghiên cứu đặc điểm sinh học của da nam từ 50.000 mẫu da khác nhau trên toàn thế giới."
                    },
                    {
                      title: "Giai đoạn 2: Phát triển công thức (12-24 tháng)",
                      text: "Kết hợp các hoạt chất độc quyền, thử nghiệm trên mô hình da 3D và tối ưu hóa công thức cho hiệu quả tối đa."
                    },
                    {
                      title: "Giai đoạn 3: Thử nghiệm lâm sàng (6-12 tháng)",
                      text: "Kiểm tra hiệu quả và độ an toàn trên 2.000+ tình nguyện viên nam giới ở các độ tuổi và chủng tộc khác nhau."
                    },
                    {
                      title: "Giai đoạn 4: Sản xuất & Ra mắt",
                      text: "Sản xuất theo tiêu chuẩn quốc tế, đảm bảo chất lượng đồng nhất trên toàn cầu."
                    }
                  ]}
                />
              </>
            )}

            {/* Section 2: Thêm Image Grid và Progress Bars */}
            {index === 2 && section.images && (
              <>
                <ImageGrid 
                  images={section.images}
                  className={styles.ingredientsGrid}
                />
                <HighlightBox 
                  title="Tiêu chuẩn nguyên liệu L'Oréal"
                  icon="FiCheckCircle"
                  color="#2ecc71"
                  items={[
                    "12 trang trại hữu cơ được chứng nhận trên toàn thế giới",
                    "100% nguyên liệu có thể truy xuất nguồn gốc minh bạch",
                    "Nồng độ hoạt chất cao hơn 40% so với tiêu chuẩn ngành",
                    "Cam kết Zero Carbon Footprint trong sản xuất"
                  ]}
                />
                <div style={{ margin: '50px 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '30px', color: '#2c3e50', textAlign: 'center' }}>
                    Chất lượng nguyên liệu so với tiêu chuẩn ngành
                  </h3>
                  <ProgressBar label="Hoa cam Bergamot - Độ tinh khiết" value={98} color="#f39c12" />
                  <ProgressBar label="Bơ Shea - Hàm lượng Vitamin E" value={95} color="#2ecc71" />
                  <ProgressBar label="Caffeine - Nồng độ hoạt tính" value={92} color="#e74c3c" />
                  <ProgressBar label="Pro-Retinol - Độ ổn định" value={97} color="#9b59b6" />
                </div>
              </>
            )}

            {/* Section 3: Product Showcase với enhancements */}
            {index === 3 && section.product && (
              <>
                <ProductShowcase product={section.product} />
                <FeaturedQuote 
                  text="Chúng tôi tin rằng mọi nam giới đều xứng đáng có được làn da khỏe mạnh mà không cần tốn quá nhiều thời gian phức tạp."
                  author="Jean-Paul Agon"
                  role="CEO L'Oréal Group"
                />
                <div className={styles.keyPointsGrid}>
                  <div className={styles.keyPoint}>
                    <div className={styles.keyPointIcon} style={{ background: '#0066cc15' }}>
                      <ModernIcon name="FiClock" size={28} color="#0066cc" />
                    </div>
                    <h4 className={styles.keyPointTitle}>Hiệu quả nhanh</h4>
                    <p className={styles.keyPointText}>Kết quả rõ rệt chỉ sau 7 ngày sử dụng đầu tiên</p>
                  </div>
                  <div className={styles.keyPoint}>
                    <div className={styles.keyPointIcon} style={{ background: '#e74c3c15' }}>
                      <ModernIcon name="FiShield" size={28} color="#e74c3c" />
                    </div>
                    <h4 className={styles.keyPointTitle}>An toàn tuyệt đối</h4>
                    <p className={styles.keyPointText}>Đã qua 2.000 ca thử nghiệm lâm sàng</p>
                  </div>
                  <div className={styles.keyPoint}>
                    <div className={styles.keyPointIcon} style={{ background: '#2ecc7115' }}>
                      <ModernIcon name="FiAward" size={28} color="#2ecc71" />
                    </div>
                    <h4 className={styles.keyPointTitle}>Công thức độc quyền</h4>
                    <p className={styles.keyPointText}>Được cấp bằng sáng chế tại 45 quốc gia</p>
                  </div>
                  <div className={styles.keyPoint}>
                    <div className={styles.keyPointIcon} style={{ background: '#f39c1215' }}>
                      <ModernIcon name="FiStar" size={28} color="#f39c12" />
                    </div>
                    <h4 className={styles.keyPointTitle}>Đánh giá cao</h4>
                    <p className={styles.keyPointText}>4.8/5 sao từ 50.000+ người dùng</p>
                  </div>
                </div>
              </>
            )}

            {/* Section 4: Expert Review với Progress Bars */}
            {index === 4 && section.expertImage && (
              <>
                <div className={styles.expertReview}>
                  <div className={styles.expertImage}>
                    <img 
                      src={section.expertImage} 
                      alt="Chuyên gia"
                      className={styles.expertImg}
                    />
                  </div>
                  <blockquote className={styles.expertQuote}>
                    <ModernIcon name="FiAward" size={24} color="#0066cc" />
                    <p className={styles.expertQuoteText}>{section.pullQuote}</p>
                    <cite className={styles.expertCitation}>Bác sĩ Nguyễn Minh Tuấn</cite>
                  </blockquote>
                </div>
                <div style={{ margin: '50px 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '30px', color: '#2c3e50', textAlign: 'center' }}>
                    Kết quả nghiên cứu lâm sàng tại Việt Nam
                  </h3>
                  <ProgressBar label="Tăng độ ẩm da - Hydra Energetic" value={67} color="#3498db" />
                  <ProgressBar label="Giảm nếp nhăn - Revitalift Laser X3" value={43} color="#e74c3c" />
                  <ProgressBar label="Cải thiện độ săn chắc" value={89} color="#2ecc71" />
                  <ProgressBar label="Tỷ lệ hài lòng từ bác sĩ da liễu" value={91} color="#9b59b6" />
                </div>
                <div className={styles.calloutBox}>
                  <ModernIcon name="FiInfo" size={24} color="#f39c12" className={styles.calloutIcon} />
                  <h4 className={styles.calloutTitle}>Lưu ý quan trọng</h4>
                  <p className={styles.calloutText}>
                    Nghiên cứu được tiến hành trong 24 tháng tại Bệnh viện Da liễu Trung ương với 200 bệnh nhân nam 
                    trong độ tuổi 25-45. Kết quả được đo lường bằng thiết bị chuyên dụng Corneometer và Cutometer.
                  </p>
                </div>
              </>
            )}

            {/* Default pull quote cho các sections khác */}
            {section.pullQuote && !section.stats && !section.expertImage && !section.product && index !== 1 && (
              <blockquote className={styles.pullQuote}>
                <div className={styles.quoteIcon}>
                  <ModernIcon name="FiAward" size={24} color="#0066cc" />
                </div>
                <p className={styles.quoteText}>{section.pullQuote}</p>
              </blockquote>
            )}

            {/* Info Box cho tất cả sections có infoBox */}
            {section.infoBox && index !== 0 && index !== 2 && (
              <InfoBox 
                title={section.infoBox.title}
                content={section.infoBox.content}
                position={section.infoBox.position}
              />
            )}
          </article>
        ))}

        {/* Conclusion Section - Enhanced */}
        <section className={styles.conclusionSection}>
          <h2 className={styles.conclusionTitle}>Kết luận</h2>
          <p className={styles.conclusionText}>{articleData.conclusion}</p>
          
          <div className={styles.statCardsGrid} style={{ marginTop: '50px' }}>
            <StatCard 
              icon="FiTrendingUp" 
              value="2.3 TỶ €" 
              label="Doanh thu 2024" 
              color="#2ecc71" 
            />
            <StatCard 
              icon="FiUsers" 
              value="50M+" 
              label="Người dùng" 
              color="#3498db" 
            />
            <StatCard 
              icon="FiGlobe" 
              value="120+" 
              label="Quốc gia" 
              color="#9b59b6" 
            />
            <StatCard 
              icon="FiAward" 
              value="#1" 
              label="Thương hiệu da nam" 
              color="#f39c12" 
            />
          </div>
        </section>
      </main>

      {/* Article Footer */}
      <footer className={styles.articleFooter}>
        {/* Social Sharing Section */}
        <div className={styles.socialSharing}>
          <h3 className={styles.sectionTitle}>
            <ModernIcon name="FiShare2" size={20} />
            Chia sẻ bài viết
          </h3>
          <div className={styles.socialButtons}>
            <button className={styles.socialButton} style={{background: '#3b5998'}}>
              <ModernIcon name="FaFacebookF" size={20} />
              Chia sẻ Facebook
            </button>
            <button className={styles.socialButton} style={{background: '#1da1f2'}}>
              <ModernIcon name="FaTwitter" size={20} />
              Chia sẻ Twitter
            </button>
            <button className={styles.socialButton} style={{background: '#0077b5'}}>
              <ModernIcon name="FaLinkedinIn" size={20} />
              Chia sẻ LinkedIn
            </button>
            <button className={styles.socialButton} style={{background: '#25d366'}}>
              <ModernIcon name="FaWhatsapp" size={20} />
              Chia sẻ WhatsApp
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div className={styles.tagsSection}>
          <h3 className={styles.tagsTitle}>
            <ModernIcon name="FiTag" size={20} />
            Thẻ bài viết
          </h3>
          <div className={styles.tagsList}>
            {articleData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Author Bio Section */}
        <div className={styles.authorBio}>
          <h3 className={styles.authorBioTitle}>
            <ModernIcon name="FiUsers" size={20} />
            Về chuyên gia
          </h3>
          <div className={styles.authorBioContent}>
            <div className={styles.authorBioImage}>
              <div className={styles.authorAvatar}>
                <ModernIcon name="FiUser" size={40} color="#ffffff" />
              </div>
            </div>
            <div className={styles.authorBioText}>
              <h4 className={styles.authorName}>{authorInfo.name}</h4>
              <p className={styles.authorTitle}>{authorInfo.role}</p>
              <p className={styles.authorExperience}>{authorInfo.experience}</p>
              <div className={styles.authorCredentials}>
                {authorInfo.credentials.map((credential, index) => (
                  <span key={index} className={styles.credential}>{credential}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className={styles.relatedArticles}>
          <h3 className={styles.relatedTitle}>
            <ModernIcon name="FiArrowRight" size={20} />
            Bài viết liên quan
          </h3>
          <div className={styles.relatedGrid}>
            {relatedArticles.map((article, index) => (
              <div key={index} className={styles.relatedCard}>
                <div className={styles.relatedImage}>
                  <ModernIcon name="FiFileText" size={24} />
                </div>
                <div className={styles.relatedContent}>
                  <a href="#" className={styles.relatedLink}>{article}</a>
                  <div className={styles.relatedMeta}>
                    <ModernIcon name="FiClock" size={16} />
                    <span>5 phút đọc</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>
            <ModernIcon name="FiMessageCircle" size={20} />
            Bình luận ({Math.floor(Math.random() * 20) + 5})
          </h3>
          <div className={styles.commentsList}>
            <div className={styles.comment}>
              <div className={styles.commentAvatar}>
                <ModernIcon name="FiUser" size={20} />
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>Nguyễn Văn B</span>
                  <span className={styles.commentDate}>2 ngày trước</span>
                </div>
                <p className={styles.commentText}>Bài viết rất hữu ích! Cảm ơn tác giả đã chia sẻ những thông tin quý giá về L'Oréal Men Expert.</p>
                <div className={styles.commentActions}>
                  <button className={styles.commentAction}>
                    <ModernIcon name="FiThumbsUp" size={16} />
                    Thích
                  </button>
                  <button className={styles.commentAction}>
                    <ModernIcon name="FiMessageSquare" size={16} />
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.comment}>
              <div className={styles.commentAvatar}>
                <ModernIcon name="FiUser" size={20} />
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>Trần Thị C</span>
                  <span className={styles.commentDate}>1 ngày trước</span>
                </div>
                <p className={styles.commentText}>Tôi đang sử dụng sản phẩm này và thấy hiệu quả thật sự. Bài viết giải thích rất rõ về quy trình nghiên cứu.</p>
                <div className={styles.commentActions}>
                  <button className={styles.commentAction}>
                    <ModernIcon name="FiThumbsUp" size={16} />
                    Thích
                  </button>
                  <button className={styles.commentAction}>
                    <ModernIcon name="FiMessageSquare" size={16} />
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.commentForm}>
            <div className={styles.commentInputGroup}>
              <ModernIcon name="FiUser" size={20} />
              <input 
                type="text" 
                placeholder="Viết bình luận của bạn..." 
                className={styles.commentInput}
              />
              <button className={styles.commentSubmit}>
                <ModernIcon name="FiSend" size={16} />
                Gửi
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========== FOOTER - PHẦN CHÂN TRANG ========== */}
      <footer className={styles.siteFooter}>
        <div className={styles.footerMain}>
          {/* Về chúng tôi */}
          <div className={styles.footerSection}>
            <h3>Về Chúng Tôi</h3>
            <div className={styles.footerAbout}>
              <p>Khoa học & Báo chí - Nền tảng tin tức uy tín, cung cấp thông tin chất lượng về khoa học, công nghệ, đời sống và nhiều lĩnh vực khác.</p>
              <ul className={styles.footerContact}>
                <li>
                  <ModernIcon name="FiBuilding" size={16} color="#bdc3c7" />
                  Tòa soạn: 123 Đường ABC, Quận 1, TP.HCM
                </li>
                <li>
                  <ModernIcon name="FiPhone" size={16} color="#bdc3c7" />
                  Hotline: 1900-1234
                </li>
                <li>
                  <ModernIcon name="FiMail" size={16} color="#bdc3c7" />
                  Email: lienhe@khoahocbao.vn
                </li>
              </ul>
            </div>
          </div>

          {/* Chuyên mục */}
          <div className={styles.footerSection}>
            <h3>Chuyên Mục</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#">Xã hội</a></li>
              <li><a href="#">Kinh tế</a></li>
              <li><a href="#">Thể thao</a></li>
              <li><a href="#">Khoa học</a></li>
              <li><a href="#">Giải trí</a></li>
              <li><a href="#">Công nghệ</a></li>
            </ul>
          </div>

          {/* Liên kết */}
          <div className={styles.footerSection}>
            <h3>Liên Kết</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Liên hệ quảng cáo</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">RSS</a></li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div className={styles.footerSection}>
            <h3>Kết Nối Với Chúng Tôi</h3>
            <div className={styles.socialMedia}>
              <div className={styles.socialIcon}>
                <ModernIcon name="FaFacebookF" size={18} color="currentColor" />
              </div>
              <div className={styles.socialIcon}>
                <ModernIcon name="FaInstagram" size={18} color="currentColor" />
              </div>
              <div className={styles.socialIcon}>
                <ModernIcon name="FaYoutube" size={18} color="currentColor" />
              </div>
              <div className={styles.socialIcon}>
                <ModernIcon name="FaTiktok" size={18} color="currentColor" />
              </div>
            </div>
            <p style={{marginTop: '20px', fontSize: '0.9rem', lineHeight: '1.6'}}>
              Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật tin tức mới nhất mỗi ngày.
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerCopyright}>
            © 2025 Khoa học & Báo chí. Tất cả quyền được bảo lưu. | Giấy phép xuất bản số: 123/GP-BTTTT
          </div>
          <div className={styles.footerLegal}>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Quy chế hoạt động</a>
          </div>
        </div>

        <p className={styles.developerCredit}>Được phát triển bởi MiniMax Agent</p>
      </footer>
    </div>
  );
}