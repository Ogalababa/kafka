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

                const statusList = await Promise.all(
                    names.map(async name => {
                        try {
                            const statusRes = await axios.get(`/kafka/connectors/${name}/status`);
                            return {
                                name,
                                status: statusRes.data.connector?.state,
                                type: statusRes.data.type,
                                worker: statusRes.data.connector?.worker_id,
                                error: null,
                            };
                        } catch (err) {
                            return {
                                name,
                                status: 'Error',
                                type: '—',
                                worker: '—',
                                error: err.toString(),
                            };
                        }
                    })
                );

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
                        <td className={`px-4 py-2 font-semibold ${
                            c.status === 'RUNNING' ? 'text-green-600' :
                                c.status === 'FAILED' ? 'text-red-600' :
                                    c.status === 'Error' ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                            {c.status}
                        </td>
                        <td className="px-4 py-2">{c.type}</td>
                        <td className="px-4 py-2">{c.worker}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default KafkaStatus;
