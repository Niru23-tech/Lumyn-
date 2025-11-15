
import React, { useState } from 'react';
import Layout from '../components/shared/Layout';
import AppointmentRequests from '../components/counsellor/AppointmentRequests';
import CalendarView from '../components/counsellor/CalendarView';
import StudentJournalsView from '../components/counsellor/StudentJournalsView';
import Chat from '../components/shared/Chat';
import { useAuth } from '../hooks/useAuth';
import { CalendarIcon, JournalIcon, UsersIcon, ChatBubbleLeftRightIcon } from '../components/shared/icons/Icons';


type ActiveTab = 'requests' | 'calendar' | 'journals' | 'chat';

const CounsellorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>('requests');

    const renderContent = () => {
        if (!user) return null;
        switch (activeTab) {
            case 'requests':
                return <AppointmentRequests counsellorId={user.id} />;
            case 'calendar':
                return <CalendarView counsellorId={user.id} />;
            case 'journals':
                return <StudentJournalsView />;
            case 'chat':
                return <Chat currentUser={user} />;
            default:
                return <AppointmentRequests counsellorId={user.id} />;
        }
    };
    
    // Fix: Changed icon type from JSX.Element to React.ReactElement to resolve namespace issue.
    const NavButton = ({ tab, label, icon }: { tab: ActiveTab, label: string, icon: React.ReactElement }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tab 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <Layout>
            <div className="flex flex-col h-full md:flex-row">
                <nav className="flex-shrink-0 w-full p-4 bg-white border-b md:w-64 md:border-r dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Counsellor Portal</h2>
                    <div className="space-y-2">
                        <NavButton tab="requests" label="Requests" icon={<UsersIcon />} />
                        <NavButton tab="calendar" label="Calendar" icon={<CalendarIcon />} />
                        <NavButton tab="journals" label="Student Journals" icon={<JournalIcon />} />
                        <NavButton tab="chat" label="Chat" icon={<ChatBubbleLeftRightIcon />} />
                    </div>
                </nav>
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {renderContent()}
                </main>
            </div>
        </Layout>
    );
};

export default CounsellorDashboard;