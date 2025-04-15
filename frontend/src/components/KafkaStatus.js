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
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Kafka Connectors</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Naam</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Worker</th>
                </tr>
                </thead>
                <tbody>
                {connectors.map((c, index) => (
                    <tr key={index} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={tdStyle}>
                <span
                    style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: c.status === 'RUNNING' ? 'green' : 'red',
                        marginRight: '8px',
                        verticalAlign: 'middle',
                    }}
                    title={c.status}
                ></span>
                            <span style={{ verticalAlign: 'middle' }}>
                  {c.status === 'RUNNING' ? 'Running' : 'Failed'}
                </span>
                        </td>
                        <td style={tdStyle}>{c.name}</td>
                        <td style={tdStyle}>{c.type}</td>
                        <td style={tdStyle}>{c.worker}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

// 公共样式
const thStyle = {
    textAlign: 'left',
    padding: '8px 16px',
    borderBottom: '1px solid #ccc',
};

const tdStyle = {
    padding: '8px 16px',
};

export default KafkaStatus;
