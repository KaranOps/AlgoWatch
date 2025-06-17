const axios = require('axios');
require('dotenv').config();

exports.fetchCodeforcesData = async (handle) => {
  try {
    // Fetch all data in parallel for efficiency
    const [userInfoRes, ratingRes, submissionsRes] = await Promise.all([
      axios.get(`${process.env.CODEFORCES_API}.info?handles=${handle}`),
      axios.get(`${process.env.CODEFORCES_API}.rating?handle=${handle}`),
      axios.get(`${process.env.CODEFORCES_API}.status?handle=${handle}`)
    ]);

    const user = userInfoRes.data.result[0];
    
    return {
      currentRating: user.rating || 0,
      maxRating: user.maxRating || 0,
      userInfo: user,
      ratingHistory: ratingRes.data.result,
      submissions: submissionsRes.data.result
    };
  } catch (err) {
    console.error("Failed to fetch Codeforces data:", err.message);
    return {
      currentRating: 0,
      maxRating: 0,
      userInfo: null,
      ratingHistory: [],
      submissions: []
    };
  }
};
