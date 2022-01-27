
const moment = require("moment-timezone");
const firestoreClient = require('./../helpers/FireStoreClient')
const uuid = require("uuid");

class Calendar {

    // static async createCalendar(calendar, counselorId) {

    //     let doc = await firestoreClient.firestore
    //         .collection('calendar')
    //         .doc(calendar.eventDate)
    //         .set(calendar)

    //     //await doc.update({ id: doc.id });

    //     return doc;

    // };

    static async getCalendar(counselorId) {
        return (await firestore.collection("calendar").doc(counselorId).get()).data();
    };

    static async createEvent(event, eventDate) {

        return await firestoreClient.firestore
            .collection("calendar")
            .doc(event.counselorId)
            .collection("events")
            .doc(eventDate)
            .set(event)

    };

    static async getEvents(eventDate, counselorId) {
        const res = (await (await firestoreClient.
            firestore
            .collection('calendar')
            .doc(counselorId)
            .collection('events')
            .doc(eventDate))
            .get()).data()

        if (res)
            return res
        else return {
            meetings_details: false
        }

    }

}

module.exports = Calendar