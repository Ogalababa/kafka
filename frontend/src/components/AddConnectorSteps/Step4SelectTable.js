import React from 'react';

const Step4SelectTable = ({ formData, setFormData, nextStep, prevStep }) => {
    const handleSelect = (e) => {
        setFormData({ ...formData, selectedTable: e.target.value });
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Select Source Table</label>
            <select
                value={formData.selectedTable}
                onChange={handleSelect}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">-- Choose a table --</option>
                {formData.availableTables.map((t, idx) => (
                    <option key={idx} value={t}>
                        {t}
                    </option>
                ))}
            </select>

            <div className="flex justify-between">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!formData.selectedTable}
                    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                    ✅ Next
                </button>
            </div>
        </div>
    );
};

export default Step4SelectTable;
