import React, { useState } from 'react';
import axios from 'axios';

const Step7Overview = ({ formData, prevStep, closeModal }) => {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                connectorName: formData.connectorName,
                sourceDatabase: formData.databaseInfo,
                selectedTable: formData.selectedTable,
                selectedColumns: formData.selectedColumns,
                sinkDatabases: formData.sinkDatabases,
            };

            await axios.post('/api/addconnector', payload);
            setDone(true);
        } catch (err) {
            setError('❌ Failed to add connector. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Step 7: Overview</h2>

            <div className="space-y-2 text-sm">
                <p><strong>Connector Name:</strong> {formData.connectorName}</p>
                <p><strong>Source Database:</strong> {formData.databaseInfo.databaseName}</p>
                <p><strong>Selected Table:</strong> {formData.selectedTable}</p>
                <p><strong>Selected Columns:</strong> {formData.selectedColumns.join(', ')}</p>

                <div>
                    <strong>Sink Databases:</strong>
                    <ul className="list-disc list-inside ml-4">
                        {formData.sinkDatabases.map((sink, idx) => (
                            <li key={idx}>{sink.databaseName}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {done && <p className="text-green-600 mt-4">✅ Connector added successfully!</p>}

            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Back</button>
                <button
                    onClick={handleConfirm}
                    disabled={loading || done}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Add Connector'}
                </button>
            </div>
        </div>
    );
};

export default Step7Overview;
