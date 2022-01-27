const { Firestore } = require("@google-cloud/firestore");
const path = require('path')

class FireStoreClient{
    constructor() {
        this.firestore = new Firestore({
            projectId: 'just-plate-316506',
            keyFilename:path.join(__dirname,'../config/just-plate-316506-5a64d98ec09d.json')
        })
    }

    async save(collection_name, data) {
        const docRef = this.firestore.collection(collection_name).doc(data.id)
        return await docRef.set(data)
    }

    get instance() {
        return this.firestore
    }

    set instance(o) {
        this.firestore = o
    }

    async getData(collection_name,documentId) {
        return await this.firestore
            .collection(collection_name)
            .doc(documentId)
            .get()
    }
}


module.exports= new FireStoreClient()