import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KafkaStatus = () => {
    const [connectors, setConnectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/kafka/connectors')
            .then(async res => {
                const names = Array.isArray(res.data) ? res.data : [];
                const results = await Promise.all(names.map(async name => {
                    try {
                        const statusRes = await axios.get(`/kafka/connectors/${name}/status`);
                        const connector = statusRes.data.connector;
                        const tasks = statusRes.data.tasks || [];

                        return {
                            name,
                            type: statusRes.data.type,
                            worker: connector.worker_id,
                            tasks: tasks.map(task => ({
                                id: task.id,
                                state: task.state,
                                trace: task.trace || null,
                                worker_id: task.worker_id
                            }))
                        };
                    } catch (err) {
                        return {
                            name,
                            type: 'unknown',
                            worker: 'unknown',
                            tasks: [{
                                id: 0,
                                state: 'FAILED',
                                trace: err.message,
                                worker_id: 'unknown'
                            }]
                        };
                    }
                }));
                setConnectors(results);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>⏳ Loading connectors...</p>;
    if (error) return <p className="text-red-600">❌ Failed to load data: {error}</p>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Kafka Connectors</h2>
            <div className="overflow-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2">Connector</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Worker</th>
                        <th className="text-left p-2">Tasks</th>
                    </tr>
                    </thead>
                    <tbody>
                    {connectors.map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-2 font-medium">{c.name}</td>
                            <td className="p-2">{c.type}</td>
                            <td className="p-2">{c.worker}</td>
                            <td className="p-2">
                                <div className="flex flex-wrap gap-2">
                                    {c.tasks.map(task => (
                                        <div
                                            key={task.id}
                                            title={task.trace || ''}
                                            className={`px-2 py-1 rounded text-white text-xs ${
                                                task.state === 'RUNNING'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            Task {task.id}: {task.state}
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KafkaStatus;
