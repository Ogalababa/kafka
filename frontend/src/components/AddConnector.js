import React, { useState } from 'react';
import AddConnectorModal from './AddConnectorModal';

const AddConnector = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                ➕ Add Connector
            </button>

            {isModalOpen && (
                <AddConnectorModal closeModal={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default AddConnector;
