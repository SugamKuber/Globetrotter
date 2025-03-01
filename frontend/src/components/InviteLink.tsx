import React from 'react';
import { FiLink, FiCopy, FiCheckCircle, FiLoader } from 'react-icons/fi';

interface InviteLinkProps {
    inviteLink: string;
    loading: boolean;
    copySuccess: string;
    onCopy: () => void;
}

const InviteLink: React.FC<InviteLinkProps> = ({ inviteLink, loading, copySuccess, onCopy }) => {
    return (
        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 m-6">
            <div className="flex items-center gap-3 mb-4 justify-between">
                <div className="flex gap-3">
                    <FiLink className="text-2xl" />
                    <h3 className="text-xl font-semibold">Your Invite Link</h3>
                </div>
                <button
                    onClick={onCopy}
                    disabled={!inviteLink}
                    className="bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg border border-blue-500/50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <FiCopy className="text-blue-400" />
                    <span>Copy</span>
                </button>
            </div>
            {loading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiLoader className="animate-spin" />
                    Generating invite link...
                </div>
            ) : (
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 truncate"
                    />
                </div>
            )}
            {copySuccess && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                    <FiCheckCircle />
                    {copySuccess}
                </div>
            )}
        </div>
    );
};

export default InviteLink;
