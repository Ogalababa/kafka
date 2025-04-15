import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KafkaStatus = () => {
    const [connectors, setConnectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 请求 connector 名称列表并逐个拉状态
    useEffect(() => {
        axios.get('/kafka/connectors')
            .then(async res => {
                const names = Array.isArray(res.data) ? res.data : [];
                const statusList = await Promise.all(names.map(async name => {
                    try {
                        const statusRes = await axios.get(`/kafka/${name}/status`);
                        return { name, ...statusRes.data };
                    } catch (err) {
                        return { name, error: err.toString() };
                    }
                }));

                setConnectors(statusList);
                setLoading(false);
            })
            .catch(err => {
                setError(err.toString());
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Bezig met laden...</p>;
    if (error) return <p>Fout bij ophalen van data: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Kafka Connectors</h2>
            {connectors.length === 0 ? (
                <p>Geen connectors gevonden.</p>
            ) : (
                <table className="table-auto w-full border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Naam</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Worker</th>
                    </tr>
                    </thead>
                    <tbody>
                    {connectors.map((c, index) => (
                        <tr key={index} className="border-t">
                            <td className="px-4 py-2">{c.name}</td>
                            <td className="px-4 py-2">
                                {c.error ? (
                                    <span className="text-red-600">Error</span>
                                ) : (
                                    c.connector?.state || 'N/A'
                                )}
                            </td>
                            <td className="px-4 py-2">{c.type || '—'}</td>
                            <td className="px-4 py-2">{c.connector?.worker_id || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default KafkaStatus;
