import React from 'react';

export default function PennyDimeLogo({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#fcf9f4" stroke="#eae6df" strokeWidth="2" />
        <path
          d="M26 26 H46 C56 26 62 31 62 40 C62 48 56 54 46 54 H37 V74 H26 V26 Z M37 36 V44 H45 C49 44 52 42 52 40 C52 38 49 36 45 36 H37 Z"
          fill="#03241a"
        />
        <path
          d="M48 26 H64 C76 26 84 34 84 50 C84 66 76 74 64 74 H48 V64 H62 C70 64 74 58 74 50 C74 42 70 36 62 36 H48 V26 Z"
          fill="#03241a"
        />
        <path
          d="M38 52 C46 60 58 60 68 44"
          stroke="#fd8048"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
