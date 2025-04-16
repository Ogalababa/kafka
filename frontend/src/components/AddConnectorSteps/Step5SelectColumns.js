import React from 'react';

const Step5SelectColumns = ({ columns, selectedColumns, setSelectedColumns, onNext }) => {
    const handleCheckboxChange = (columnName) => {
        setSelectedColumns((prev) =>
            prev.includes(columnName)
                ? prev.filter((col) => col !== columnName)
                : [...prev, columnName]
        );
    };

    if (!columns || columns.length === 0) return <p className="text-red-500">No columns available</p>;

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Step 5: Select Columns to Sync</h2>
            <table className="table-auto w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2">Select</th>
                    <th className="px-4 py-2">Column</th>
                    <th className="px-4 py-2">Data Type</th>
                    <th className="px-4 py-2">Primary Key</th>
                    <th className="px-4 py-2">Has Default</th>
                </tr>
                </thead>
                <tbody>
                {columns.map((col, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2">
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(col.columnName)}
                                onChange={() => handleCheckboxChange(col.columnName)}
                            />
                        </td>
                        <td className="px-4 py-2">{col.columnName}</td>
                        <td className="px-4 py-2">{col.dataType}</td>
                        <td className="px-4 py-2">
                            {col.isPrimaryKey ? <span className="text-green-600 font-semibold">PK</span> : ''}
                        </td>
                        <td className="px-4 py-2">
                            {col.hasDefault ? '✅' : ''}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4">
                <button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={selectedColumns.length === 0}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default Step5SelectColumns;
