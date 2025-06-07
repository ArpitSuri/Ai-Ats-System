// utils/atsScore.js
module.exports = function scoreATS(resumeText, keywords) {
    let score = 0;
    keywords.forEach((keyword) => {
        const regex = new RegExp(keyword.trim(), "gi");
        const matches = resumeText.match(regex);
        if (matches) score += matches.length * 5;
    });
    return Math.min(score, 100);
};