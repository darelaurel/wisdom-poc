const firestore = require('./../helpers/FireStoreClient')
const _ = require('lodash')
const { randomBytes } = require('crypto')
const moment = require("moment-timezone");
const Interval = require('math.interval')
const calendar = require('./../services/Calendar')
const DAYS = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
};
class UserSetting {

    /**
     * Create Counselor Settings // for use cases
     **/
    static async createConselorSetting() {

        const doc_id = randomBytes(10).toString('hex')

        const data = {
            id: "0356281a774446f98915",
            userId: "0356281a774446f98915",
            timezone: {
                name: "Africa/Algiers",
                offset: "+01:00 CET"
            },
            availableHours: [
                {
                    fri: [{ from: "08:30", to: "10:00" }, { from: "12:00", to: "15:00" }, { from: "17:00", to: "18:00" }],
                    mon: [{ from: "08", to: "09" }, { from: "12", to: "13" }],
                    sat: [],
                    sun: [{ from: "00", to: "01" }, { from: "08", to: "09" }],
                    thu: [{ from: "08", to: "09" }],
                    tue: [{ from: "20:08", to: "22:08" }],
                    wed: [{ from: "08", to: "09" }]
                }
            ]
        }

        const result = await firestore.save('counselors_settings', data)

        //console.log(await UserSetting.isAvailable('2022-01-24T08:10','2022-01-24T08:30',data.id))

        // const response = await this.getAvailableHours(data.id) // for test purpose

        // console.log({response})

    }
    /**
     * return availables hours of Counselor
     **/
    static async getAvailableHours(counselorId) {

        const docs = await (await firestore.getData('counselors_settings', counselorId)).data()

        return docs.availableHours[0]

    }

    /**
     * Check if the fromDate and toDate of booking is available
     * on Counselor day calendar
     **/
    static async isAvailable(fromDate, toDate, counselorId, timeZone = "Africa/Porto-Novo") {

        let available;

        fromDate = moment(fromDate).tz(timeZone);

        toDate = moment(toDate).tz(timeZone);

        //get day of week of fromDate
        const dayOfWeek = moment(fromDate).tz(timeZone).day();

        const availableHours = await UserSetting.getAvailableHours(counselorId);

        console.log({ fromDate, toDate })

        //return avaialable Time of Counsolor for the day
        let availableTime = availableHours[DAYS[dayOfWeek]];

        if (!availableTime.length) {
            return false
        }
        else {

            _.forEach(availableTime, (o) => {

                const { from, to } = o;

                const fromTime = moment(from, "HH:mm");

                const avFromTime = moment(fromDate).set({
                    hour: fromTime.get("hour"),
                    minute: fromTime.get("minute"),
                });

                const toTime = moment(to, "HH:mm");

                const avToTime = moment(toDate).set({
                    hour: toTime.get("hour"),
                    minute: toTime.get("minute"),
                });

                const fromDateBetween = moment(fromDate).isBetween(
                    avFromTime,
                    avToTime,
                );

                console.log({ fromDateBetween })

                const toDateBetween = moment(toDate).isBetween(
                    avFromTime,
                    avToTime
                );

                if (fromDateBetween && toDateBetween) {
                    available = true
                }

            })

            return available ? available : false
        }
    }

    static async availableTime(counselorId, fromD, timeZone, duration) {

        let { meetings_details } = await calendar.getEvents(fromD, counselorId)

        let fromDate = moment(fromD)

        let times = [], tmpTimes = []


        const dayOfWeek = fromDate.day();

        const availableHours = await UserSetting.getAvailableHours("0356281a774446f98915");

        let availableTime = availableHours[DAYS[dayOfWeek]];

        if (!meetings_details) {

            _.forEach(availableTime, (item) => {
                const { from, to } = item
                times.push(...[from, to])
            })

            return times

        }

        // check if event from and to date are included inside the available time range

        _.forEach(meetings_details, (elmnt) => {

            const { from, to } = elmnt;

            const fromEventTime = moment(from, "HH:mm");

            const toEventTime = moment(to, "HH:mm");

            let avFromEventTime = moment(fromDate).set({
                hour: fromEventTime.get('hour'),
                minute: fromEventTime.get('minute')
            })

            let avToEventTime = moment(fromDate).set({
                hour: toEventTime.get('hour'),
                minute: toEventTime.get('minute')
            })

            _.forEach(availableTime, (item) => {

                const { from, to } = item

                const fromTime = moment(from, "HH:mm");
                const toTime = moment(to, "HH:mm");

                let avFromTime = moment(fromDate).set({
                    hour: fromTime.get('hour'),
                    minute: fromTime.get('minute')
                })

                let avToTime = moment(fromDate).set({
                    hour: toTime.get('hour'),
                    minute: toTime.get('minute')
                })



                let fromDataBetween = moment(avFromEventTime).isBetween(avFromTime, avToTime, undefined, [])

                let toDataBetween = moment(avToEventTime).isBetween(avFromTime, avToTime, undefined, [])

                console.log({ avFromTime, avToTime })

                if ((fromDataBetween && toDataBetween)) {

                    times.push({ from: item.from, to: item.to, extract: { from: elmnt.from, to: elmnt.to } })

                } else {





                    times.push({ from: item.from, to: item.to })

                }
            })
        })

        return times


    }

    static async nextEvent(fromDate, time, events) {

        let k = _.filter(events, ['from', time]), nextElement;

        console.log('step ?')

        console.log(events)

        let index = _.findIndex(events, k[0])

        console.log(index)

        if (index === events.length - 1) {
            nextElement = events[++index]
        } else {
            nextElement = events[events.length - 1]
        }


        console.log({ nextElement })

        const dateFromTime = moment(k[0].to, 'hh:mm')
        const dateToTime = moment(nextElement.from, 'hh:mm')


        let avTime = moment(fromDate).set({
            hour: dateFromTime.hour(),
            minute: dateFromTime.minute()
        })

        let avToTime = moment(fromDate).set({
            hour: dateToTime.hour(),
            minute: dateToTime.minute()
        })

        return [avTime, avToTime]
    }

    static async getRealAvailableTimes(fromDate, availableTime, { from, to }, timeZone = "Africa/Porto-Novo", duration = 15) {

        let times = []

        const fromEventTime = moment(from, "HH:mm");

        const toEventTime = moment(to, "HH:mm");

        let avFromEventTime = moment(fromDate).set({
            hour: fromEventTime.get('hour'),
            minute: fromEventTime.get('minute')
        })

        let avToEventTime = moment(fromDate).set({
            hour: toEventTime.get('hour'),
            minute: toEventTime.get('minute')
        })

        _.forEach(availableTime, (item) => {

            const { from, to } = item

            const fromTime = moment(from, "HH:mm");
            const toTime = moment(to, "HH:mm");

            let avFromTime = moment(fromDate).set({
                hour: fromTime.get('hour'),
                minute: fromTime.get('minute')
            })

            let avToTime = moment(fromDate).set({
                hour: toTime.get('hour'),
                minute: toTime.get('minute')
            })



            let fromDataBetween = moment(avFromEventTime).isBetween(avFromTime, avToTime, undefined, [])

            let toDataBetween = moment(avToEventTime).isBetween(avFromTime, avToTime, undefined, [])

            if ((fromDataBetween && toDataBetween)) {

                while (avFromEventTime.isAfter(avFromTime)) {
                    times.push(avFromTime.format('HH:mm'))
                    avFromTime = moment(avFromTime).add(duration, 'minutes')
                    times.push(avFromTime.format('HH:mm'))
                }


                while (avToEventTime.isBefore(avToTime)) {
                    times.push(avToEventTime.format('HH:mm'))
                    avToEventTime = moment(avToEventTime).add(duration, 'minutes')
                }

            } else {
                times.push(JSON.stringify({ from: avFromTime.format('HH:mm'), to: avToTime.format('HH:mm') }))
            }
        })

        return times
    }

    // static async availableTimes(counselorId, fromD, timeZone = "Africa/Porto-Novo", duration = 15) {

    //     // const availableHours = await UserSetting.getAvailableHours("0356281a774446f98915");

    //     // let fromDate = moment(fromD)

    //     // let times = [], tmpTimes = []


    //     // const dayOfWeek = fromDate.day();

    //     // console.log({ availableHours })

    //     // let availableTime = availableHours[DAYS[dayOfWeek]];

    //     // let { meetings_details } = await calendar.getEvents(fromD, counselorId)

    //     // meetings_details = _.orderBy(meetings_details, ['from'], ['asc'])

    //     // availableTime = _.orderBy(availableTime, ['from'], ['asc'])






    //     //console.log({availableTime})

    //     // let availabilityInterval = [_.minBy(availableTime, 'from').from, _.maxBy(availableTime, 'to').to]

    //     // let intervalEventHours = [_.minBy(meetings_details, 'from').from, _.maxBy(meetings_details, 'to').to]


    //     // const dateFromTime = moment(availabilityInterval[0],'hh:mm').tz(timeZone)

    //     // const dateToTime = moment(availabilityInterval[1], 'hh:mm').tz(timeZone)


    //     // let avFromTime = moment(fromDate).set({
    //     //     hour: dateFromTime.hour(),
    //     //     minute: dateFromTime.minute()
    //     // })

    //     // let avToTime = moment(fromDate).set({
    //     //     hour: dateToTime.hour(),
    //     //     minute: dateToTime.minute()
    //     // })

    //     // meetings_details = _.orderBy(meetings_details, ['from'], ['asc'])

    //     // // events
    //     // console.log("events",)
    //     // const dateFromEventTime = moment(intervalEventHours[0], "HH:mm").tz(timeZone)

    //     // const dateToEventTime = moment(intervalEventHours[1], "HH:mm").tz(timeZone)

    //     // let avFromEventTime = moment(fromDate).set({
    //     //     hour: dateFromEventTime.hour(),
    //     //     minute: dateFromEventTime.minute()
    //     // })

    //     // let avToEventTime = moment(fromDate).set({
    //     //     hour: dateToEventTime.hour(),
    //     //     minute: dateToEventTime.minute()
    //     // })

    //     // let fromDateBetween = moment(avFromEventTime).isBetween(avFromTime, avToTime, undefined, [])

    //     // let toDateBetween = moment(avToEventTime).isBetween(avFromTime, avToTime, undefined, [])

    //     // if (fromDateBetween && toDateBetween) {

    //     //     while (avFromTime.isSameOrBefore(avFromEventTime)) {


    //     //         if (avFromTime.isSame(avFromEventTime)) {

    //     //             console.log({ avFromTime, avFromEventTime})

    //     //             const [a,b] = await this.nextEvent(fromDate, avFromTime.format('HH:mm'), meetings_details)

    //     //             avFromTime = a

    //     //             console.log({a,b})

    //     //             avFromEventTime = b



    //     //         } else {

    //     //             console.log({ avFromTime })

    //     //             avFromTime = avFromTime.add(duration, 'minutes')

    //     //         }


    //     //     }
    //     // }

    //     // return times




    //     // 
    //     // const dateFromEventTime = moment(intervalEventHours[0].from, "HH:mm");

    //     // const dateToEventTime = moment(intervalEventHours[0].to, "HH:mm");

    //     // let avFromEventTime = moment(fromDate).set({
    //     //     hour: dateFromEventTime.get('hour'),
    //     //     minute: dateFromEventTime.get('minute')
    //     // })

    //     // let avToEventTime = moment(fromDate).set({
    //     //     hour: dateToEventTime.get('hour'),
    //     //     minute: dateToEventTime.get('minute')
    //     // })

    //     // let fromDateBetween = moment(avFromEventTime).isBetween(avFromTime, avToTime, undefined, [])

    //     // let toDateBetween = moment(avToEventTime).isBetween(avFromTime, avToTime, undefined, [])







    //     // return availabilityInterval[0]



    //     //let times = this.availableTime(counselorId, fromD, timeZone, duration)


    //     //return times

    //     // let { meetings_details } = await calendar.getEvents(fromD, counselorId)

    //     // let fromDate = moment(fromD)

    //     // let times = [], tmpTimes = []


    //     // const dayOfWeek = fromDate.day();

    //     // const availableHours = await UserSetting.getAvailableHours("0356281a774446f98915");

    //     // let availableTime = availableHours[DAYS[dayOfWeek]];

    //     if (!meetings_details) {

    //         _.forEach(availableTime, (item) => {
    //             const { from, to } = item
    //             times.push(...[from, to])
    //         })

    //         return times

    //     }

    //     // // check if event from and to date are included inside the available time range


    //     _.forEach(meetings_details, (item) => {
    //         const result = this.getRealAvailableTimes(fromDate, availableTime, item, timeZone)

    //         console.log({result})
    //     })

    //     // else {
    //     //     tmpTimes.push(item)
    //     //     //console.log({avFromEventTime,avToEventTime})
    //     //     if (avFromTime.isBefore(avFromEventTime) && avToTime.isBefore(avFromEventTime)) {
    //     //         tmpTimes.push(item)

    //     //     }
    //     // }




    //     //     })






    //     // })


    //     // times = _.uniqBy(times)

    //     // return times


    // }

    // static async availableTimes(fromD, duration, timeZone, counselorId) {
    //     /**
    //      * fromDate is a ISO string - UTC
    //      */
    //     let fromDate = moment(fromD).tz(timeZone);
    //     let times = [];

    //     const dayOfWeek = fromDate.day();

    //     const userSettings = await UserSetting.getAvailableHours(counselorId);

    //     const availableHours = userSettings.availableHours;

    //     let availableTime = availableHours[DAYS[dayOfWeek]][0];

    //     const { from, to } = availableTime;
    //     let fromTime = moment(fromDate)
    //         .set({
    //             hour: moment(from).hour,
    //             minute: moment(from).minute,
    //         })
    //         .tz(userSettings.timezone.name, true);
    //     let hour = fromTime.get("hour");
    //     let minute = fromTime.get("minute");
    //     const currentTime = moment().tz(userSettings.timezone.name);

    //     console.log(fromTime, moment(to, "HH:mm"));

    //     // if available date is the same as the current date and after then set the fromTime to current time
    //     if (
    //         currentTime.isSame(fromTime, "day") &&
    //         currentTime.isAfter(fromTime, "minutes")
    //     ) {
    //         fromTime = currentTime.set({ minute });
    //         hour = currentTime.hour;
    //     }

    //     let avFromTime = moment(fromTime).set({
    //         hour,
    //         minute,
    //     });

    //     const toTime = moment(to)
    //         .set({ day: fromDate.day, month: fromDate.month, year: fromDate.year })
    //         .tz(userSettings.timezone.name, true);
    //     const avToTime = moment(toTime).set({
    //         hour: toTime.get("hour"),
    //         minute: toTime.get("minute"),
    //     });

    //     while (avFromTime.isSameOrBefore(avToTime)) {
    //         let t = { from: moment(avFromTime, "HH:mm").format() };
    //         avFromTime = avFromTime.add(duration, "minutes");
    //         t.to = moment(avFromTime, "HH:mm").format();
    //         times.push(t);
    //     }

    //     return times;
    // }

    static parseFloat(value) {
        value = parseFloat(value.toString().replace(':', '.')) 
        return value
    }

    static revertParseFloat(value) {

        value = parseFloat(value).toFixed(2)

        if (value.includes('.')) {
            value = value.toString().replace('.', ':')
        }
        else if (value.toString().includes(':')) {
            value = value
        } else {
            value = value.toString() + ':' + '00'
        }

        console.log({value})

        return value
    }

    static fromDate(from, value) {

        console.log({value})

        value = moment(this.revertParseFloat(value), 'hh:mm')

        console.log({value})

        return moment(from).set({
            hour: value.hour(),
            minute: value.minute()
        })

    }


    static async availableTimes(counselorId, fromD, timeZone = "Africa/Porto-Novo", duration = 15) {

        let tmpTime = [], realTime=[];

        // Get available hour of specific counselor setting

        const availableHours = await UserSetting.getAvailableHours("0356281a774446f98915");

        // Encapsulate the from date into moment js object

        let fromDate = moment(fromD)

        // get the day of the week

        const dayOfWeek = fromDate.day();

        // Get available Times

        let availableTimes = availableHours[DAYS[dayOfWeek]], tmpAvailable=[],keepTmpAvailable=[];

        // Get events of the counselor of this specific day(fromDate)

        let { meetings_details } = await calendar.getEvents(fromD, counselorId)


        
        

        // return { meetings_details, availableTimes };

        // Re-order available times and events times

        meetings_details = _.orderBy(meetings_details, ['from'], ['asc'])

        availableTimes = _.orderBy(availableTimes, ['from'], ['asc'])


        _.forEach(meetings_details, (event_time) => {

            let { from, to } = event_time

            let beginEv = from, endEv = to;

            _.forEach(availableTimes, (available_time, index) => {

                let { from: start, to: end } = available_time

                let startTime = this.parseFloat(start)

                let endTime = this.parseFloat(end)

                let fromEvTime = this.parseFloat(beginEv)

                let toEvTime = this.parseFloat(endEv)

                if (fromEvTime >= startTime && toEvTime <= endTime && toEvTime <= endTime && toEvTime > startTime) {

                    availableTimes = availableTimes.filter((el, i) => i != index)

                    let start = this.revertParseFloat(startTime)
                    
                    let fromEv = this.revertParseFloat(fromEvTime)

                    let toEv = this.revertParseFloat(toEvTime)

                    let end = this.revertParseFloat(endTime)

                    if (start != fromEv) {
                        tmpAvailable.push({ from: start, to: fromEv })
                    }

                    if (end != toEv) {
                        tmpAvailable.push({ from: toEv, to: end })
                    }
                        
                    
                } else {
                    keepTmpAvailable.push({ from: start, to: end })
                    
                    availableTimes = availableTimes.filter((el, i) => i != index)

                    
                }

            


                // if (interval.contains(new Interval(`[${fromEv},${toEv}]`))) {

                //     minmax = [Math.min(start, fromEv), Math.max(end, toEv)]

                //     console.log({ minmax })

                //     // if (fromEv != minmax[0]) {

                //     let avFromTime = this.fromDate(fromD, minmax[0])

                //     let avToTime = this.fromDate(fromD, minmax[1])

                //     let avEventFromTime = this.fromDate(fromD, fromEv)

                //     let avEventToTime = this.fromDate(fromD, toEv)

                //     let 

                //     //realTime.push([{from:,to:}])
                    


                //         //console.log({ fromEv,avEventFromTime })

                //     // while (!avFromTime.isSame(avToTime)) {
                            
                //     //         console.log({avFromTime,avEventFromTime})

                //     //         if (!avFromTime.isSame(avEventFromTime) || !avFromTime.isBetween(avEventFromTime, avEventToTime)) {
                //     //             tmpTime.push(avFromTime.format('HH:mm'))
                //     //             avFromTime = avFromTime.add(duration, 'minutes')
                //     //         }
                //     //     }

                //     // }


                // }



            })

            availableTimes = keepTmpAvailable.concat(tmpAvailable)

            keepTmpAvailable = []

            tmpAvailable = []


        })

        _.forEach(availableTimes, (item) => {
            
            let { from, to } = item
            
            from = moment(from, 'HH:mm')
            
            to = moment(to, 'HH:mm')
            

            let avFromDate = moment(fromDate).set({
                hour: from.hour(),
                minute: from.minute()
            })

            let avToDate = moment(fromDate).set({
                hour: to.hour(),
                minute: to.minute()
            })

            while (avToDate.isAfter(avFromDate)) {

                if (avToDate.diff(avFromDate, 'minutes') >= duration) {
                    
                    realTime.push(avFromDate.format('HH:mm'))

                    avFromDate = avFromDate.add(duration, 'minute')

                } else {

                    break;

                }
                
                // if (!avToDate.add(`-${duration}`, 'minute').isBefore(avFromDate)) {
                //     break;
                // }
                
            }
        })

        return realTime
        // _.forEach(meetings_details, (item) => {
        //     let { from, to } = item
            
        //     realTime = _.filter(tmpTime, (o) => {
        //         return o!=from
        //     })

        //     realTime = _.filter(realTime, (o) => {
        //         return o != to
        //     })
        //     // console.log(this.fromDate(fromD,from))
        // })

        // console.log(realTime)

        // return realTime

    }

    static getListTimes({
        avFromTime,
        avToTime,
        duration,
        userTimeZone,
        meetingId,
        events,
    }) {
        let ret = [];
        let nextTime = moment(avFromTime).tz(userTimeZone);
        let idx = 0;
        do {
            const free = UserSetting.verifyCalendar({
                timeSlot: nextTime,
                duration,
                meetingId,
                events,
            });
            if (free) {
                ret[idx++] = nextTime.format("HH:mm");
            }
            nextTime = nextTime.add(duration, "minutes");
        } while (nextTime.isBefore(avToTime));
        return ret;
    }

    static verifyCalendar({ timeSlot, meetingId, events, timeZone }) {
        let free = true;
        if (events.items && events.items.length > 0) {
            events.items.forEach(
                ({
                    id,
                    end: { dateTime: endDateTime },
                    start: { dateTime: startDateTime },
                }) => {
                    if (!meetingId || meetingId != id) {
                        startDateTime = moment(startDateTime).tz(timeZone);
                        endDateTime = moment(endDateTime).tz(timeZone);
                        timeSlot = moment(timeSlot).tz(timeZone);

                        if (
                            timeSlot.isBetween(startDateTime, endDateTime, undefined, "[]")
                        ) {
                            free = false;
                        }
                    }
                }
            );
        }
        return free;
    }
}

module.exports = UserSetting;