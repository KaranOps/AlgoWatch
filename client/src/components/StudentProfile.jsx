import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from 'react-chartjs-2';

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentProfile() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [cfData, setCfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contestFilter, setContestFilter] = useState(30);

    useEffect(() => {
        async function fetchStudentAndCF() {
            setLoading(true);
            try {
                // Fetch student info from your backend
                const res = await fetch(`${API_URL}/students/${id}`);
                const data = await res.json();
                setStudent(data);

                // Fetch Codeforces data if handle exists
                if (data.codeforcesHandle) {
                    const cfRes = await fetch(`${API_URL}/codeforces/user/${data.codeforcesHandle}`);
                    const cfJson = await cfRes.json();
                    setCfData(cfJson);
                }
            } catch (err) {
                console.error("Failed to fetch student or Codeforces data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStudentAndCF();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!student) return <div className="p-8 text-red-600">Student not found.</div>;

    // Filter contests by days
    let filteredContests = [];
    if (cfData && cfData.rating) {
        const now = Date.now() / 1000;
        filteredContests = cfData.rating.filter(contest => now - contest.ratingUpdateTimeSeconds < contestFilter * 24 * 60 * 60);
    }

    // Prepare data for rating graph
    const ratingGraph = {
        labels: filteredContests.map(c => c.contestName),
        datasets: [
            {
                label: 'Rating',
                data: filteredContests.map(c => c.newRating),
                fill: false,
                borderColor: 'rgb(0,0,255)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link to="/" className="text-blue-600 underline mb-4 inline-block">
                ← Back to Dashboard
            </Link>
            <h2 className="text-2xl font-bold mb-4">{student.name}'s Profile</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>Codeforces Handle:</strong> {student.codeforcesHandle}</p>
                <p><strong>Current Rating:</strong> {student.currentRating}</p>
                <p><strong>Max Rating:</strong> {student.maxRating}</p>
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Codeforces Data</h3>
                {!cfData && <div>Loading Codeforces data...</div>}
                {cfData && cfData.userInfo && (
                    <div className="p-4 bg-white rounded shadow">
                        <p><strong>Handle:</strong> {cfData.userInfo.handle}</p>
                        <p><strong>Current Rating:</strong> {cfData.userInfo.rating}</p>
                        <p><strong>Max Rating:</strong> {cfData.userInfo.maxRating}</p>
                        <p><strong>Rank:</strong> {cfData.userInfo.rank}</p>
                        <p><strong>Contribution:</strong> {cfData.userInfo.contribution}</p>
                        <p><strong>Friend of Count:</strong> {cfData.userInfo.friendOfCount}</p>
                    </div>
                )}
            </div>
            {/* Placeholder for Contest History and Problem Solving Data */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Contest History</h3>
                <div className="flex gap-2 mb-2">
                    {[30, 90, 365].map(days => (
                        <button key={days} className={`px-9 py-1 rounded ${contestFilter === days ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setContestFilter(days)}>Last {days} days</button>
                    ))}
                </div>
                {filteredContests.length > 0 ? (
                    <>
                        <Line data={ratingGraph} />
                        <ul className="list-disc list-inside mt-4">
                            {filteredContests.map((contest, idx) => (
                                <li key={contest.contestId || idx}>
                                    {contest.contestName} — Rank: {contest.rank}, Old: {contest.oldRating}, New: {contest.newRating}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (<p>No contest history available in this period.</p>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Problem Solving Data</h3>
                {cfData && cfData.submissions && cfData.submissions.length > 0 ? (
                    <p>Total submissions: {cfData.submissions.length}</p>
                ) : (
                    <p>No problem-solving data available.</p>
                )}
            </div>
        </div>
    );
}
