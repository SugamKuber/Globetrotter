import React from 'react';

interface LogoutButtonProps {
    onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    return (
        <button
            onDoubleClick={onLogout}
            className="relative bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-red-500/20 hover:shadow-lg cursor-pointer group"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                />
            </svg>
            Logout
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
                Double-click to logout
            </span>
        </button>
    );
};

export default LogoutButton;
