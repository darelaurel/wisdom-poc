const zoomApiConfig = {
    zoomApiUrl: "https://zoom.us/oauth",
    zoomApiOauthKey: "0jPuokhR_ahXpFRAPPiMQ",
    zoomApiOauthSecret: "IgGSGK5IeG1C97dFhlAGdISrkMsV5Yf3",
    zoomApiOauthCallbackUrl: "https://localhost:5000/api/zoom/oauth/callback",
    // zoomApiUrl: "https://zoom.us/oauth",
    // zoomApiJwtKey: "4Osedrezpmnnyzqsq",
    // zoomApiJwtSecret: "83kfqszqerstdgyreB",
    // zoomApiOauthKey: "0jPuokhR_ahXpFRAPPiMQ",
    // zoomApiOauthSecret: "IgGSGK5IeG1C97dFhlAGdISrkMsV5Yf3",
    // zoomApiOauthCallbackUrl: "https://localhost:5000/api/zoom/oauth/callback",
};

module.exports = {
    mode: "development",
    ...zoomApiConfig,
    notifyEmailTo: "dsmsmart@gmail.com",
    //notifyEmailCC: "info@amaze.website",
    notifyEmailFrom: "info@oreeon.com",
};