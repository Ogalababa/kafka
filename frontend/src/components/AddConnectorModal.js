import React, { useState } from 'react';

const AddConnectorModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        connectorName: '',
        databaseHost: '',
        databasePort: '',
        databaseName: '',
        user: '',
        password: '',
        sourceTable: '',
        sinkDatabase: '',
        sinkTable: '',
    });

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // 将来你可以在这里提交到后端 API
        console.log('Connector configured:', formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Add New Connector</h2>

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Connector Name</label>
                            <input
                                type="text"
                                name="connectorName"
                                value={formData.connectorName}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Database Host</label>
                            <input
                                type="text"
                                name="databaseHost"
                                value={formData.databaseHost}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Port</label>
                            <input
                                type="text"
                                name="databasePort"
                                value={formData.databasePort}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Username</label>
                            <input
                                type="text"
                                name="user"
                                value={formData.user}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Source Table</label>
                            <input
                                type="text"
                                name="sourceTable"
                                value={formData.sourceTable}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Sink Database</label>
                            <input
                                type="text"
                                name="sinkDatabase"
                                value={formData.sinkDatabase}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Sink Table</label>
                            <input
                                type="text"
                                name="sinkTable"
                                value={formData.sinkTable}
                                onChange={handleChange}
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
                    >
                        Back
                    </button>
                    {step < 5 ? (
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                            Submit
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="ml-4 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddConnectorModal;
