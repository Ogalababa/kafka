import React, { useState } from 'react';
import Step1Name from './AddConnectorSteps/Step1Name';
import Step2Database from './AddConnectorSteps/Step2Database';
import Step3FetchTables from './AddConnectorSteps/Step3FetchTables';
import Step4SelectTable from './AddConnectorSteps/Step4SelectTable';
import Step5SelectColumns from './AddConnectorSteps/Step5SelectColumns';
import Step6SinkDatabases from './AddConnectorSteps/Step6SinkDatabases';
import Step7Overview from "./AddConnectorSteps/Step7Overview";

const AddConnectorModal = () => {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        connectorName: '',
        databaseInfo: {
            hostname: '',
            port: '',
            databaseName: '',
            'connection.user': '',
            'connection.password': '',
        },
        availableTables: [],
        selectedTable: '',
        selectedColumns: [],
        sinkDatabases: [
            {
                hostname: '',
                port: '',
                databaseName: '',
                'connection.user': '',
                'connection.password': '',
            },
        ],
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const handleClose = () => window.location.reload(); // 🔄 刷新页面

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-24 z-50">
            <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">🛠️ Configure Connector</h2>
                    <button onClick={handleClose} className="text-xl font-bold hover:text-red-500">×</button>
                </div>

                {step === 1 && (
                    <Step1Name formData={formData} setFormData={setFormData} nextStep={nextStep} closeModal={handleClose} />
                )}
                {step === 2 && (
                    <Step2Database formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} closeModal={handleClose} />
                )}
                {step === 3 && (
                    <Step3FetchTables formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} closeModal={handleClose} />
                )}
                {step === 4 && (
                    <Step4SelectTable formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} closeModal={handleClose} />
                )}
                {step === 5 && (
                    <Step5SelectColumns formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} closeModal={handleClose} />
                )}
                {step === 6 && (
                    <Step6SinkDatabases formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} closeModal={handleClose} />
                )}
                {step === 7 && (
                    <Step7Overview formData={formData} prevStep={prevStep} closeModal={handleClose} />
                )}
            </div>
        </div>
    );
};

export default AddConnectorModal;
