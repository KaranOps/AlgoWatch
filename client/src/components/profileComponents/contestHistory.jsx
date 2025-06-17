import { Line } from 'react-chartjs-2';

export default function contestHistory({ 
    filteredContests, 
    contestFilter, 
    setContestFilter, 
    ratingGraphData, 
    ratingGraphOptions 
}) {
    return (
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
    );
}