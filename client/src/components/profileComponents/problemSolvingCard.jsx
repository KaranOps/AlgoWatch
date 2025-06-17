import { Bar } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export default function problemSolvingCard({ 
    psFilter, 
    setPsFilter, 
    mostDifficult, 
    totalSolved, 
    avgRating, 
    avgPerDay, 
    bucketCounts, 
    ratingBuckets, 
    barChartOptions, 
    heatmapValues 
}) {
    return (
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
    );
}