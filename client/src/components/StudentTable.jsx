import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { convertToCSV } from '../utils/downloadCsv';
const API_URL = import.meta.env.VITE_API_URL;

const StudentTable = ({ onEdit, refresh }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();

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

    const handleDelete = async (id, event) => {
        event.stopPropagation();
        if (window.confirm("Delete the student?")) {
            try {
                await axios.delete(`${API_URL}/students/${id}`);
                setStudents((prev) => prev.filter((s) => s._id !== id));
            } catch (err) {
                console.error("Error deleting student:", err);
            }
        }
    };

    const handleRowClick = (student) => {
        setSelectedStudent(selectedStudent?._id === student._id ? null : student);
    };

    const handleViewProfile = (studentId, event) => {
        event.stopPropagation();
        navigate(`/student/${studentId}`);
    };

    const handleCodeforcesRedirect = (handle, event) => {
        event.stopPropagation();
        window.open(`https://codeforces.com/profile/${handle}`, '_blank');
    };

    const downloadCSV = () => {
        const csv = convertToCSV(students);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Header Section */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={downloadCSV}
                >
                    Download CSV
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider hidden lg:table-cell">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Handle</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">Current</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">Max</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {students.map((student) => (
                                <React.Fragment key={student._id}>
                                    <tr 
                                        className="hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                                        onClick={() => handleRowClick(student)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 group-hover:text-blue-700">
                                                {student.name}
                                            </div>
                                            <div className="text-sm text-gray-500 md:hidden">
                                                {student.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                                            {student.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-blue-600 font-medium">
                                                    {student.codeforcesHandle}
                                                </span>
                                                <button
                                                    onClick={(e) => handleCodeforcesRedirect(student.codeforcesHandle, e)}
                                                    className="text-blue-500 hover:text-blue-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    title="View Codeforces Profile"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center hidden sm:table-cell">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                {student.currentRating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center hidden sm:table-cell">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                {student.maxRating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    onClick={(e) => handleViewProfile(student._id, e)}
                                                >
                                                    Profile
                                                </button>
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(student);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    onClick={(e) => handleDelete(student._id, e)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Row Details */}
                                    {selectedStudent?._id === student._id && (
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <td colSpan="7" className="px-6 py-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Contest History Section */}
                                                    <div className="bg-white rounded-lg p-6 shadow-md border border-blue-200">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Contest History
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                                <span className="text-sm text-gray-600">Current Rating</span>
                                                                <span className="font-semibold text-green-600">{student.currentRating}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                                <span className="text-sm text-gray-600">Max Rating</span>
                                                                <span className="font-semibold text-purple-600">{student.maxRating}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                                <span className="text-sm text-gray-600">Rating Change</span>
                                                                <span className={`font-semibold ${student.maxRating - student.currentRating >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {student.maxRating - student.currentRating >= 0 ? '-' : '+'}{Math.abs(student.maxRating - student.currentRating)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Problem Solving Data Section */}
                                                    <div className="bg-white rounded-lg p-6 shadow-md border border-blue-200">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                                                            </svg>
                                                            Problem Solving Data
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                                <span className="text-sm text-gray-600">Codeforces Handle</span>
                                                                <span className="font-mono text-blue-600 font-medium">{student.codeforcesHandle}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                                <span className="text-sm text-gray-600">Contact</span>
                                                                <span className="text-sm text-gray-700">{student.phone}</span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleCodeforcesRedirect(student.codeforcesHandle, e)}
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                                            >
                                                                <span>View Codeforces Progress</span>
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {students.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No students found</div>
                        <div className="text-gray-400 text-sm mt-2">Add some students to get started</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentTable