import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


const StudentTable = ({onEdit, refresh}) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${API_URL}/students`);
                setStudents(res.data);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        }

        fetchStudents();
    }, [refresh]);

    const handleDelete = async (id) => {
        if (window.confirm("Delete the student?")) {
            try {
                await axios.delete(`${API_URL}/students/${id}`);
                setStudents((prev) => prev.filter((s) => s._id !== id));
            } catch (err) {
                console.error("Error deleteing student:", err);
            }
        }
    };
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-8">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Handle</th>
                        <th className="px-4 py-3">Current Rating</th>
                        <th className="px-4 py-3">Max Rating</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50 transition-all">
                            <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                            <td className="px-4 py-3">{student.email}</td>
                            <td className="px-4 py-3">{student.phone}</td>
                            <td className="px-4 py-3 font-mono text-blue-600">{student.codeforcesHandle}</td>
                            <td className="px-4 py-3 text-center">{student.currentRating}</td>
                            <td className="px-4 py-3 text-center">{student.maxRating}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded"
                                    onClick={() => onEdit(student)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded"
                                    onClick={() => handleDelete(student._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StudentTable
