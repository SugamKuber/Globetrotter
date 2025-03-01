import { FiUser } from 'react-icons/fi'
import LogoutButton from './Logout'

export default function UserHeader({ userData }: { userData: { fullname: string, highestScore: number } }) {
    return (
        <header className="w-full max-w-5xl flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <FiUser className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">{userData.fullname}</h1>
                    <p className="text-gray-400">High Score: {userData.highestScore}</p>
                </div>
            </div>
            <LogoutButton onLogout={() => console.log('User logged out')} />
        </header>
    )
}