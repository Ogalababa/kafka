// src/components/AddConnectorSteps/Step6SinkDatabases.js
import React from 'react';

const Step6SinkDatabases = ({ formData, setFormData, prevStep, nextStep }) => {
    const handleChange = (index, field, value) => {
        const newSinks = [...formData.sinkDatabases];
        newSinks[index][field] = value;
        setFormData({ ...formData, sinkDatabases: newSinks });
    };

    const addSink = () => {
        setFormData({
            ...formData,
            sinkDatabases: [
                ...formData.sinkDatabases,
                {
                    hostname: '',
                    port: '',
                    databaseName: '',
                    'connection.user': '',
                    'connection.password': ''
                }
            ]
        });
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Step 6: Add Sink Databases</h2>
            {formData.sinkDatabases.map((sink, index) => (
                <div key={index} className="mb-4 border p-4 rounded bg-gray-50">
                    <h3 className="font-semibold mb-2">Sink #{index + 1}</h3>
                    {['hostname', 'port', 'databaseName', 'connection.user', 'connection.password'].map((field) => (
                        <input
                            key={field}
                            className="w-full p-2 border mb-2 rounded"
                            placeholder={field}
                            value={sink[field]}
                            onChange={(e) => handleChange(index, field, e.target.value)}
                        />
                    ))}
                </div>
            ))}

            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>
                <div className="flex gap-4">
                    <button onClick={addSink} className="px-4 py-2 bg-green-500 text-white rounded">➕ Add Sink</button>
                    <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Step6SinkDatabases;
