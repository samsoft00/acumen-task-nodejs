import log from 'fancy-log'

import Acumen from './app'
import FirestoreManager from './firestoreManager'

require('dotenv').config()

const dbManager = FirestoreManager.getInstance()

const port =
  parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) ||
  8000

Acumen.listen(port, async () => {
  dbManager.connectDb()

  log(`Server is running on http://localhost:${port} `)
})
