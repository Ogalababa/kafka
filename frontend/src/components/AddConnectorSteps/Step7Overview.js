// src/components/AddConnectorSteps/Step7Overview.js
import React, { useState } from 'react';
import axios from 'axios';

const Step7Overview = ({ formData, prevStep, closeModal }) => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const payload = {
                connectorName: formData.connectorName,
                sourceDatabase: formData.databaseInfo,
                selectedTable: formData.selectedTable,
                selectedColumns: formData.selectedColumns,
                sinkDatabases: formData.sinkDatabases,
            };

            const res = await axios.post('/api/addconnector', payload);
            setResponse(res.data);
        } catch (err) {
            setError('❌ Failed to generate connector config.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Step 7: Overview</h2>

            <div className="space-y-2 text-sm mb-4">
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

            {response && (
                <div className="bg-gray-100 p-4 mt-4 rounded text-sm max-h-72 overflow-y-auto">
                    <h3 className="font-semibold mb-2 text-gray-800">Response from Kafka Connect:</h3>
                    <pre className="whitespace-pre-wrap break-words text-xs">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}

            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Back</button>

                {response ? (
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        ✅ Finish
                    </button>
                ) : (
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Add Connector'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Step7Overview;
