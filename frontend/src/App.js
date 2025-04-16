import React from 'react';
import KafkaStatus from './components/KafkaStatus';
import exactLogo from './assets/exact-logo.svg';
import './index.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={exactLogo} alt="Exact logo" className="h-10" />
                    <h1 className="text-2xl font-bold text-gray-800">Exact database synchronisatiesysteem</h1>
                </div>
                <nav>
                    <ul className="flex space-x-6 text-gray-600 font-medium">
                        <li className="hover:text-blue-600 cursor-pointer">Home</li>
                        {/* 后续可以添加更多菜单 */}
                    </ul>
                </nav>
            </header>

            <main className="p-6">
                <KafkaStatus />
            </main>
        </div>
    );
}

export default App;
