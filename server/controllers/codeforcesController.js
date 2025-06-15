const axios = require('axios');

exports.getCodeForcesData = async(req,res) =>{
    try {
        const {handle} = req.params;
        const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const rating = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
        const submissions = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        res.json({
            userInfo: userInfo.data.result[0],
            rating: rating.data.result,
            submissions: submissions.data.result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};