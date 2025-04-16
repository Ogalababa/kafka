import React, { useState } from 'react';
import KafkaStatus from './components/KafkaStatus';
import logo from './assets/exact-logo.svg';
import AddConnectorModal from './components/AddConnectorModal';

function App() {
    const [showConnectorModal, setShowConnectorModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <header className="bg-white shadow p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={logo} alt="Exact logo" className="h-10" />
                    <h1 className="text-2xl font-bold">Exact database synchronisatiesysteem</h1>
                </div>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li className="font-medium text-blue-600">Home</li>
                        <li>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                onClick={() => setShowConnectorModal(true)}
                            >
                                Add Connector
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="p-6">
                <KafkaStatus />
            </main>

            {showConnectorModal && (
                <AddConnectorModal onClose={() => setShowConnectorModal(false)} />
            )}
        </div>
    );
}

export default App;