export default function codeforcesStatuscard({ cfData }) {
    if (!cfData || !cfData.userInfo) return null;

    return (
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
    );
}