import fs from 'firebase-admin'

const serviceAccount = require('../key.json')
fs.initializeApp({ credential: fs.credential.cert(serviceAccount) })

/**
 * FirestoreManager
 */
export default class FirestoreManager {
  static getInstance () {
    if (!FirestoreManager.instance) {
      FirestoreManager.instance = new FirestoreManager()
    }

    return FirestoreManager.instance
  }

  connectDb () {
    this._client = fs.firestore()
  }

  getDbClient () {
    if (!this._client) throw new Error('Firestore client connection issue')
    return this._client
  }
}
