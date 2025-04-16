// src/components/AddConnectorSteps/Step2Database.js
import React from 'react';

const Step2Database = ({ formData, setFormData, nextStep, prevStep }) => {
    const db = formData.databaseInfo;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            databaseInfo: { ...db, [e.target.name]: e.target.value },
        });
    };

    const isValid = db.hostname && db.port && db.databaseName && db['connection.user'] && db['connection.password'];

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Database Host</label>
            <input type="text" name="hostname" value={db.hostname} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

            <label className="block text-sm font-medium mb-2">Port</label>
            <input type="text" name="port" value={db.port} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

            <label className="block text-sm font-medium mb-2">Database Name</label>
            <input type="text" name="databaseName" value={db.databaseName} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

            <label className="block text-sm font-medium mb-2">Username</label>
            <input type="text" name="connection.user" value={db['connection.user']} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" name="connection.password" value={db['connection.password']} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>
                <button onClick={nextStep} disabled={!isValid} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

export default Step2Database;