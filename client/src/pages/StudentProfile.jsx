import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import axios from "axios";
import contestHistory from "../components/profileComponents/contestHistory";

// Import components
import LoadingSpinner from "../components/profileComponents/loadingSpinner";
import ErrorMessage from "../components/profileComponents/errorMessage";
import PageHeader from "../components/profileComponents/pageHeader";
import StudentInfoCard from "../components/profileComponents/studentInfoCard";
import CodeforcesStatsCard from "../components/profileComponents/codeforcesStatuscard";
import ContestHistoryCard from "../components/profileComponents/contestHistory";
import ProblemSolvingCard from "../components/profileComponents/problemSolvingCard";
import SubmissionSummaryCard from "../components/profileComponents/submissionCard";

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
                // Fetch student info from backend
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
        return <LoadingSpinner />;
    }

    if (!student) {
        return <ErrorMessage message="Student not found." />;
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
                <PageHeader student={student} handleReminderToggle={handleReminderToggle} />

                <StudentInfoCard student={student} />

                <CodeforcesStatsCard cfData={cfData} />

                <ContestHistoryCard
                    filteredContests={filteredContests}
                    contestFilter={contestFilter}
                    setContestFilter={setContestFilter}
                    ratingGraphData={ratingGraphData}
                    ratingGraphOptions={ratingGraphOptions}
                />

                <ProblemSolvingCard
                    psFilter={psFilter}
                    setPsFilter={setPsFilter}
                    mostDifficult={mostDifficult}
                    totalSolved={totalSolved}
                    avgRating={avgRating}
                    avgPerDay={avgPerDay}
                    bucketCounts={bucketCounts}
                    ratingBuckets={ratingBuckets}
                    barChartOptions={barChartOptions}
                    heatmapValues={heatmapValues}
                />

                <SubmissionSummaryCard cfData={cfData} />
            </div>
        </div>
    )
}
