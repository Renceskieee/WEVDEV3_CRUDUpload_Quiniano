import React, { useState } from 'react';
import axios from 'axios';

const SearchEmployee = () => {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [records, setRecords] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/employee-records/${employeeNumber}`);
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching employee records:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Search Employee Records</h1>
            <input
                type="text"
                placeholder="Enter Employee Number"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            {records.length > 0 && (
                <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Earliest Time</th>
                            <th>Last Time</th>
                            <th>Time Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.earliest_time}</td>
                                <td>{record.last_time}</td>
                                <td>{record.time_difference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchEmployee;
