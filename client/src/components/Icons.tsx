import React from 'react';

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor"
};

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-4 w-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-12 w-12 text-green-500 mx-auto mb-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-6 w-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-6 w-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={3} className={className || "h-6 w-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={3} className={className || "h-6 w-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.95-1.48-2.05-1.08-3.5-2.95-4.2-5.12-.51-1.52-.47-3.15-.47-4.75 0-1.88.02-3.77.01-5.65.01-1.28.27-2.55.77-3.77 1.22-2.94 3.96-5.14 7.02-5.78 1.55-.33 3.13-.37 4.7-.42Z"/>
    </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z"/>
    </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C9.53 2 9.22.01 6.88.06c-1.07.02-1.79.2-2.42.47-1.48.64-2.5 1.6-3.14 3.08-.26.63-.45 1.35-.47 2.42C.01 9.22 0 9.53 0 12s.01 2.78.06 3.82c.02 1.07.2 1.79.47 2.42.64 1.48 1.6 2.5 3.08 3.14.63.26 1.35.45 2.42.47 1.04.05 1.35.06 3.82.06s2.78-.01 3.82-.06c1.07-.02 1.79-.2 2.42-.47 1.48-.64 2.5-1.6 3.14-3.08.26-.63.45-1.35.47-2.42.05-1.04.06-1.35.06-3.82s-.01-2.78-.06-3.82c-.02-1.07-.2-1.79-.47-2.42-.64-1.48-1.6-2.5-3.08-3.14-.63-.26-1.35-.45-2.42-.47C14.78 2.01 14.47 2 12 2Zm0 1.8c2.4 0 2.68.01 3.62.05.94.04 1.5.18 1.92.35.6.25 1.03.58 1.47 1.03.44.44.78.87 1.03 1.47.17.42.31.98.35 1.92.04.94.05 1.22.05 3.62s-.01 2.68-.05 3.62c-.04.94-.18 1.5-.35 1.92-.25.6-.58 1.03-1.03 1.47-.44.44-.87.78-1.47 1.03-.42.17-.98.31-1.92.35-.94.04-1.22.05-3.62.05s-2.68-.01-3.62-.05c-.94-.04-1.5-.18-1.92-.35-.6-.25-1.03-.58-1.47-1.03-.44-.44-.78-.87-1.03-1.47-.17-.42-.31-.98-.35-1.92C2.01 14.68 2 14.4 2 12s.01-2.68.05-3.62c.04-.94.18-1.5.35-1.92.25-.6.58-1.03 1.03-1.47.44-.44.87.78-1.47-1.03.42-.17.98.31 1.92-.35.94-.04 1.22-.05 3.62-.05ZM12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5ZM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-6.9a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"/>
    </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24" >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.217 3.794 4.66-1.088.29-2.222.12-3.13.016.6 1.922 2.34 3.325 4.402 3.363-1.832 1.438-4.138 2.296-6.652 2.296-.429 0-.855-.025-1.274-.075 2.38 1.521 5.223 2.416 8.32 2.416 9.98 0 15.448-8.284 15.448-15.448 0-.235-.005-.468-.014-.702.937-.678 1.75-1.523 2.408-2.49z" />
  </svg>
);

export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const PriceTagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);

export const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75V17.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
);

export const BidIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.75h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 17.25h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 21V3h15v18H4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75H9v-1.5h6v1.5z" />
    </svg>
);

// Icons merged from the previous set to support the dashboard
export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const CubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export const NewspaperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6M7 8h6" />
    </svg>
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.965 5.965 0 0112 13a5.965 5.965 0 013 5.197" />
    </svg>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} strokeWidth={2} className={className || "h-5 w-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
