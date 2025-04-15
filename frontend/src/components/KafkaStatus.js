import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KafkaStatus = () => {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(':8083/connectors')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setConnectors(data);
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
        <ul className="list-disc pl-6">
          {connectors.map(name => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KafkaStatus;

