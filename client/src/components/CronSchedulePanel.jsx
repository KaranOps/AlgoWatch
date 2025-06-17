import React from 'react'
import axios from "axios";
import { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

const CronSchedulePanel = () => {
    const [schedule, setSchedule] = useState('');
    const [message, setMessage] = useState('');
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/cron/update-cron`, { schedule });
            // console.log("check");
            setMessage(res.data.message);
            setSchedule('');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to update schedule');
        }
    }
    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">Change Cron Schedule</h2>
            <form onSubmit={handleUpdate} className="lg:flex items-center gap-4">
                <input
                    type='text'
                    className="border p-2 rounded w-64"
                    placeholder='e.g. 0 2 * * *'
                    value={schedule}
                    onChange={e => setSchedule(e.target.value)}
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" type="submit">
                    Update Schedule
                </button>
            </form>
            {message && <div className="mt-2 text-green-600">{message}</div>}
            <p className="text-xs text-gray-500 mt-1">
                Cron format: <code>min hour day month weekday</code> (e.g., <code>0 2 * * *</code> for 2AM daily)
            </p>
            <a
                className="text-blue-500 text-xs underline"
                href="https://crontab.guru/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Need help? Try crontab.guru
            </a>
        </div>
    )
}

export default CronSchedulePanel
