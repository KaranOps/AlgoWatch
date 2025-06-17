import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentProfile() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [cfData, setCfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contestFilter, setContestFilter] = useState(30);
    const [psFilter, setPsFilter] = useState(7);

    useEffect(() => {
        const fetchStudentAndCF = async () => {
            setLoading(true);
            try {
                // Fetch student info from your backend
                const res = await fetch(`${API_URL}/students/${id}`);
                const data = await res.json();
                setStudent(data);
                setCfData({
                    userInfo: data.cfUserInfo,
                    rating: data.cfRatingHistory,
                    submissions: data.cfSubmissions
                });

            } catch (err) {
                console.error("Failed to fetch student or Codeforces data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStudentAndCF();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Loading...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <p className="text-red-600 text-lg font-medium">Student not found.</p>
                </div>
            </div>
        );
    }

    // Filter contests by days
    let filteredContests = [];
    if (cfData && cfData.rating) {
        const now = Date.now() / 1000;
        filteredContests = cfData.rating.filter(contest => now - contest.ratingUpdateTimeSeconds < contestFilter * 24 * 60 * 60);
    }

    // Prepare data for rating graph
    const ratingGraphData = {
        labels: filteredContests.map(c => c.contestName),
        datasets: [
            {
                label: 'Rating',
                data: filteredContests.map(c => c.newRating),
                fill: false,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgb(59, 130, 246)',
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    let solvedProblems = [];
    if (cfData && cfData.submissions) {
        const now = Date.now() / 1000;
        solvedProblems = cfData.submissions.filter(
            sub =>
                sub.verdict === "OK" &&
                now - sub.creationTimeSeconds < psFilter * 24 * 60 * 60
        );
    }

    // Most difficult problem solved
    const mostDifficult = solvedProblems.reduce(
        (max, sub) =>
            sub.problem.rating && (!max || sub.problem.rating > max.problem.rating)
                ? sub
                : max,
        null
    );

    // Total problems solved
    const totalSolved = solvedProblems.length;

    // Average rating
    const avgRating =
        solvedProblems.length > 0
            ? (
                solvedProblems
                    .filter(sub => sub.problem.rating)
                    .reduce((sum, sub) => sum + sub.problem.rating, 0) /
                solvedProblems.filter(sub => sub.problem.rating).length
            ).toFixed(2)
            : 0;

    // Average problems per day
    const avgPerDay = (totalSolved / psFilter).toFixed(2);

    // Bar chart data
    const ratingBuckets = [800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 3000, 3500];
    const bucketCounts = ratingBuckets.map(
        (bucket) =>
            solvedProblems.filter(
                (sub) =>
                    sub.problem.rating &&
                    sub.problem.rating >= bucket &&
                    sub.problem.rating < bucket + 200
            ).length
    );

    // Heatmap data
    const heatmapValues = solvedProblems.map(sub => ({
        date: new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10),
        count: 1,
    }));

    const ratingGraphOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (tooltipItems) {
                        return tooltipItems[0].label;
                    },
                    label: function (tooltipItem) {
                        return `Rating: ${tooltipItem.formattedValue}`;
                    },
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Contests',
                    color: '#6B7280',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Rating',
                    color: '#6B7280',
                },
                grid: {
                    color: '#E5E7EB',
                },
            },
        },
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Rating Range',
                    color: '#6B7280',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Problems Solved',
                    color: '#6B7280',
                },
                grid: {
                    color: '#E5E7EB',
                },
            },
        },
    };

    //Reminder Enable disable
    const handleReminderToggle = async (e) => {
        try {
            const res = await axios.patch(`${API_URL}/students/${student._id}/email-toggle`, {
                enabled: e.target.checked,
            });
            setStudent(res.data);
        } catch (error) {
            console.error("Failed to update email toggle:", error);
            alert("Something went wrong when updating the email toggle");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 mb-6"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <div className="md:flex justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                {student.name}'s Profile
                            </h1>
                            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
                        </div>
                        <div className="bg-white rounded p-4 shadow mt-6">
                            <h2 className="text-xl font-bold mb-4">Reminder Email Settings</h2>
                            <p>
                                <strong>Reminders Sent:</strong> {student.reminderCount ?? 0}
                            </p>
                            <div className="flex items-center mt-2">
                                <label htmlFor="autoEmailToggle" className="mr-2 font-medium">
                                    Automatic Reminder Emails:
                                </label>
                                <input
                                    id="autoEmailToggle" type="checkbox" checked={student.autoEmailEnabled ?? true}
                                    onChange={handleReminderToggle}
                                />
                                <span className="ml-2 text-sm">
                                    {student.autoEmailEnabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-gray-900">{student.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-gray-900">{student.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Codeforces Handle</p>
                            <p className="text-gray-900 font-mono">{student.codeforcesHandle}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Current Rating</p>
                            <p className="text-gray-900 font-semibold">{student.currentRating}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Max Rating</p>
                            <p className="text-gray-900 font-semibold">{student.maxRating}</p>
                        </div>
                    </div>
                </div>

                {/* Codeforces Data Card */}
                {cfData && cfData.userInfo && (
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Codeforces Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-600">Handle</p>
                                <p className="text-lg font-semibold text-blue-900 font-mono">{cfData.userInfo.handle}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-600">Current Rating</p>
                                <p className="text-lg font-semibold text-green-900">{cfData.userInfo.rating}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-purple-600">Max Rating</p>
                                <p className="text-lg font-semibold text-purple-900">{cfData.userInfo.maxRating}</p>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-indigo-600">Rank</p>
                                <p className="text-lg font-semibold text-indigo-900">{cfData.userInfo.rank}</p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-yellow-600">Contribution</p>
                                <p className="text-lg font-semibold text-yellow-900">{cfData.userInfo.contribution}</p>
                            </div>
                            <div className="bg-pink-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-pink-600">Friend of Count</p>
                                <p className="text-lg font-semibold text-pink-900">{cfData.userInfo.friendOfCount}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contest History */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Contest History</h2>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[30, 90, 365].map(days => (
                            <button
                                key={days}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${contestFilter === days
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => setContestFilter(days)}
                            >
                                Last {days} days
                            </button>
                        ))}
                    </div>

                    {filteredContests.length > 0 ? (
                        <div className="space-y-6">
                            <div className="h-64 sm:h-80">
                                <Line data={ratingGraphData} options={ratingGraphOptions} />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Recent Contests</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {filteredContests.map((contest, idx) => (
                                        <div key={contest.contestId || idx} className="flex flex-wrap items-center justify-between bg-white p-3 rounded-md">
                                            <span className="font-medium text-gray-900 flex-1 min-w-0 mr-4">{contest.contestName}</span>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-gray-600">Rank: <span className="font-medium">{contest.rank}</span></span>
                                                <span className="text-gray-600">
                                                    {contest.oldRating} → <span className={`font-medium ${contest.newRating > contest.oldRating ? 'text-green-600' : 'text-red-600'}`}>{contest.newRating}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500">No contest history available in this period.</p>
                        </div>
                    )}
                </div>

                {/* Problem Solving Data */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Problem Solving Analytics</h2>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[7, 30, 90].map(days => (
                            <button
                                key={days}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${psFilter === days
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => setPsFilter(days)}
                            >
                                Last {days} days
                            </button>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                            <p className="text-blue-100 text-sm font-medium">Most Difficult</p>
                            <p className="text-lg font-bold">
                                {mostDifficult ? `${mostDifficult.problem.rating}` : 'N/A'}
                            </p>
                            {mostDifficult && (
                                <p className="text-blue-100 text-xs mt-1 truncate">{mostDifficult.problem.name}</p>
                            )}
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                            <p className="text-green-100 text-sm font-medium">Total Solved</p>
                            <p className="text-lg font-bold">{totalSolved}</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                            <p className="text-purple-100 text-sm font-medium">Average Rating</p>
                            <p className="text-lg font-bold">{avgRating}</p>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                            <p className="text-indigo-100 text-sm font-medium">Per Day</p>
                            <p className="text-lg font-bold">{avgPerDay}</p>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Problems by Rating Range</h3>
                        <div className="h-64 sm:h-80">
                            <Bar
                                data={{
                                    labels: ratingBuckets.map(r => `${r}-${r + 199}`),
                                    datasets: [
                                        {
                                            label: 'Problems Solved',
                                            data: bucketCounts,
                                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                            borderColor: 'rgba(59, 130, 246, 1)',
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        },
                                    ],
                                }}
                                options={barChartOptions}
                            />
                        </div>
                    </div>

                    {/* Heatmap */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Activity</h3>
                        <div className="w-sm h-sm bg-gray-50 rounded-lg p-3 overflow-x-auto">
                            <div className="">
                                <CalendarHeatmap
                                    startDate={new Date(Date.now() - psFilter * 24 * 60 * 60 * 1000)}
                                    endDate={new Date()}
                                    values={heatmapValues}
                                    classForValue={value => {
                                        if (!value) return 'color-empty';
                                        if (value.count > 4) return 'color-github-4';
                                        if (value.count > 2) return 'color-github-3';
                                        if (value.count > 0) return 'color-github-2';
                                        return 'color-github-1';
                                    }}
                                    gutterSize={1}
                                    squareSize={10}
                                    showWeekdayLabels={false}
                                    showMonthLabels={true}
                                    fontSize={10}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Problem Solving Data */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Submission Summary</h2>
                    {cfData && cfData.submissions && cfData.submissions.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{cfData.submissions.length}</div>
                            <p className="text-gray-600">Total Submissions</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500">No problem-solving data available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}