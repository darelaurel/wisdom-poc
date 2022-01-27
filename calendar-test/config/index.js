const zoomApiConfig = {
    zoomApiUrl: "https://zoom.us/oauth",
    zoomApiOauthKey: "0jPuokhR_ahXpFRAPPiMQ",
    zoomApiOauthSecret: "IgGSGK5IeG1C97dFhlAGdISrkMsV5Yf3",
    zoomApiOauthCallbackUrl: "https://localhost:5000/api/zoom/oauth/callback",
};

module.exports = {
    ...zoomApiConfig
};