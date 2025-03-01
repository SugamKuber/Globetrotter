import React from 'react';
import { FiUsers, FiLoader, FiUser } from 'react-icons/fi';

interface Invitee {
    id: string;
    name: string;
    highestScore: number;
}

interface InviteesProps {
    invitees: Invitee[];
    loading: boolean;
    error: string;
}

const Invitees: React.FC<InviteesProps> = ({ invitees, loading, error }) => {
    return (
        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 m-6">
            <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-2xl text-blue-400" />
                <h3 className="text-xl font-semibold">Your Invitees</h3>
            </div>
            {loading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiLoader className="animate-spin" />
                    Loading invitees...
                </div>
            ) : error ? (
                <p className="text-red-400 text-center py-4">{error}</p>
            ) : invitees.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No invitees yet</p>
            ) : (
                <div className="space-y-3">
                    {invitees.map((invitee) => (
                        <div
                            key={invitee.id}
                            className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                        >
                            <div className="flex items-center gap-3">
                                <FiUser className="text-gray-400" />
                                <span className="font-medium">{invitee.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">High Score:</span>
                                <span className="font-mono text-purple-400">{invitee.highestScore}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Invitees;
