// src/components/AddConnectorSteps/Step1Name.js
import React from 'react';

const Step1Name = ({ formData, setFormData, nextStep }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, connectorName: e.target.value });
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Connector Name</label>
            <input
                type="text"
                value={formData.connectorName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., sqlserver-source-users"
            />
            <button
                disabled={!formData.connectorName}
                onClick={nextStep}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
};

export default Step1Name;
