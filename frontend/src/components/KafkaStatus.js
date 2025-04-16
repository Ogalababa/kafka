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
                        return {
                            name,
                            status: statusRes.data.connector.state,
                            type: statusRes.data.type,
                            worker: statusRes.data.connector.worker_id,
                        };
                    } catch (err) {
                        return {
                            name,
                            status: 'FAILED',
                            type: 'unknown',
                            worker: 'unknown',
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

    if (loading) return <p>⏳ Bezig met laden...</p>;
    if (error) return <p className="text-red-600">❌ Fout bij ophalen van data: {error}</p>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Kafka Connectors</h2>
            <div className="overflow-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Naam</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Worker</th>
                    </tr>
                    </thead>
                    <tbody>
                    {connectors.map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-2">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${c.status === 'RUNNING' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {c.status}
                            </td>
                            <td className="p-2">{c.name}</td>
                            <td className="p-2">{c.type}</td>
                            <td className="p-2">{c.worker}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KafkaStatus;
