import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/exact-logo.svg'; // 确保这个路径是对的
import KafkaStatus from './components/KafkaStatus';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={logo} alt="Exact logo" className="h-8" />
                    <h1 className="text-2xl font-semibold text-gray-800">Exact ELIS</h1>
                </div>
                <nav className="space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                    <Link to="/connectors" className="text-gray-600 hover:text-blue-600 font-medium">Connectors</Link>
                    <Link to="/settings" className="text-gray-600 hover:text-blue-600 font-medium">Settings</Link>
                </nav>
            </header>

            <main className="p-6">
                <KafkaStatus />
            </main>
        </div>
    );
}

export default App;
