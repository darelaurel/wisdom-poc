const express = require('express');
const router = express.Router();
const ZoomApi = require('../services/ZoomApi.js')
const counselorSettings = require('../services/CounselorSettings')
const calendar = require('../services/Calendar')
const moment = require("moment-timezone");



router.get("/available", async (req, res) => {

    calendar.createEvent({
        id: "0356281a774446f98915",
        counselorId: "0356281a774446f98915",
        meetings_details: [{
            topic: '',
            meetingId: null,
            from: "09:05",
            to: "09:30",
            url: ""
        },
        {
            topic: '',
            meetingId: null,
            from: "12:00",
            to: "12:30",
            url: ""
            },
            {
                topic: '',
                meetingId: null,
                from: "13:30",
                to: "14:00",
                url: ""
            },
            {
                topic: '',
                meetingId: null,
                from: "17:00",
                to: "17:30",
                url: ""
            },
            //  {
            //         topic: '',
            //         meetingId: null,
            //         from: "17:15",
            //         to: "17:30",
            //         url: ""
            //     }, {
            //         topic: '',
            //         meetingId: null,
            //         from: "20:00",
            //         to: "21:00",
            //         url: ""
            //     }
        ]

    }, moment("2022-01-28").format("YYYY-MM-DD"))

    res.send('ok cool alors')
});

router.post('/availability', async (req, res) => {

    const { fromDate = "2022-01-28", counselorId = "0356281a774446f98915" } = req.body

    const availability = await counselorSettings.availableTimes(counselorId, fromDate)

    res.json(availability)
})

router.get("/test", async (req, res) => {

    counselorSettings.createConselorSetting()

    res.send('ok cool alors bro')
});

module.exports = router