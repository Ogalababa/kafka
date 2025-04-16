// src/components/AddConnectorSteps/Step3FetchTables.js
import React, { useState } from 'react';
import axios from 'axios';

const Step3FetchTables = ({ formData, setFormData, nextStep, prevStep }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetch = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post('/api/tables', formData.databaseInfo);
            setFormData({ ...formData, availableTables: res.data });
            nextStep();
        } catch (err) {
            setError('❌ Failed to obtain the table, please check the database configuration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p className="mb-4">Click the button to get all tables in the current database</p>
            <div className="flex justify-between">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>
                <button onClick={handleFetch} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">
                    {loading ? 'Loading...' : 'Fetch Tables'}
                </button>
            </div>
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default Step3FetchTables;