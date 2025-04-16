import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Step5SelectColumns = ({ formData, setFormData, nextStep, prevStep }) => {
    const [columns, setColumns] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const payload = {
                    ...formData.databaseInfo,
                    "table.name": formData.selectedTable
                };

                const res = await axios.post('/api/columns', payload);
                setColumns(res.data);
                setFormData((prev) => ({
                    ...prev,
                    selectedColumns: res.data.map(col => col.columnName) // ✅ 默认全选
                }));
            } catch (err) {
                setError('Failed to fetch columns.');
            }
        };

        fetchColumns();
    }, [formData.databaseInfo, formData.selectedTable]);

    const toggleColumn = (columnName) => {
        setFormData((prev) => ({
            ...prev,
            selectedColumns: prev.selectedColumns.includes(columnName)
                ? prev.selectedColumns.filter(col => col !== columnName)
                : [...prev.selectedColumns, columnName]
        }));
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Step 5: Select Columns to Sync</h2>
            {error && <p className="text-red-500">{error}</p>}
            <table className="table-auto w-full border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-2 py-1">Select</th>
                    <th className="px-2 py-1">Column</th>
                    <th className="px-2 py-1">Data Type</th>
                    <th className="px-2 py-1">PK</th>
                    <th className="px-2 py-1">Default</th>
                </tr>
                </thead>
                <tbody>
                {columns.map((col, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="px-2 py-1">
                            <input
                                type="checkbox"
                                checked={formData.selectedColumns.includes(col.columnName)}
                                onChange={() => toggleColumn(col.columnName)}
                            />
                        </td>
                        <td className="px-2 py-1">{col.columnName}</td>
                        <td className="px-2 py-1">{col.dataType}</td>
                        <td className="px-2 py-1">{col.isPrimaryKey ? 'PK' : ''}</td>
                        <td className="px-2 py-1">{col.hasDefault ? '✅' : ''}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Back</button>
                <button
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={formData.selectedColumns.length === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step5SelectColumns;
