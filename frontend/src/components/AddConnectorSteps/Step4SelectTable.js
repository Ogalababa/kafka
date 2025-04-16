import React, { useState } from 'react';
import axios from 'axios';

const Step4SelectTable = ({ formData, setFormData, nextStep, prevStep }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSelect = (e) => {
        setFormData({ ...formData, selectedTable: e.target.value });
    };

    const handleNext = async () => {
        if (!formData.selectedTable) return;

        const payload = {
            ...formData.databaseInfo,
            "table.name": formData.selectedTable,
        };

        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/columns', payload);
            setFormData({ ...formData, columns: res.data });
            nextStep(); // 进入 Step5
        } catch (err) {
            console.error('❌ Failed to fetch columns:', err);
            setError('Failed to fetch columns. Please try again.');
        } finally {
            setLoading(false);
        }
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

            {error && <p className="text-red-600 mb-2">{error}</p>}

            <div className="flex justify-between items-center">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!formData.selectedTable || loading}
                    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                    {loading ? 'Loading...' : '✅ Next'}
                </button>
            </div>
        </div>
    );
};

export default Step4SelectTable;
