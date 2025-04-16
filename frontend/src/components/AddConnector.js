// src/components/AddConnector.js
import React, { useState } from 'react';
import AddConnectorModal from './AddConnectorModal';

const AddConnector = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="text-right p-4">
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow"
            >
                ➕ Add Connector
            </button>
            {showModal && <AddConnectorModal closeModal={() => setShowModal(false)} />}
        </div>
    );
};

export default AddConnector;
