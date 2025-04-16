// src/components/AddConnectorSteps/Step7Overview.js
import React from 'react';
import axios from 'axios';

const Step7Overview = ({ formData, prevStep, closeModal }) => {
    const handleSubmit = async () => {
        try {
            await axios.post('/api/addconnector', formData);
            alert('✅ Connector created successfully');
            closeModal();
        } catch (err) {
            alert('❌ Failed to create connector');
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Step 7: Review & Create</h2>
            <div className="bg-gray-50 p-4 rounded border text-sm max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Add Connector</button>
            </div>
        </div>
    );
};

export default Step7Overview;
