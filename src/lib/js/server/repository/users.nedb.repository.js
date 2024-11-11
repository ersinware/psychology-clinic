import crypto from 'crypto'
import Datastore from 'nedb'

const usersDb = new Datastore({filename: 'db/users.db', autoload: true}),
    authDb = new Datastore({filename: 'db/authenticatedUsers.db', autoload: true})

usersDb.ensureIndex(
    {fieldName: 'email', unique: true},
    error => {
        if (error) console.error('Error creating index on email:', error)
    }
)

authDb.ensureIndex(
    {fieldName: 'sessionId', unique: true},
    (error) => {
        if (error) console.error('Error creating index on sessionId:', error)
    })

usersDb.persistence.setAutocompactionInterval(60000)
authDb.persistence.setAutocompactionInterval(60000)

export async function createUser(email, password) {
    try {
        await insertUser({email, password})
    } catch (error) {
        return error.message
    }
}

export async function signIn(email, password) {
    try {
        const user = await findUser({email, password})
        if (!user)
            return {error: 'Kullanıcı adı veya şifre hatalı.'}

        const sessionId = crypto.randomBytes(16).toString('hex')
        await insertSession({sessionId})

        return {sessionId}
    } catch (error) {
        return {error: error.message}
    }
}

export async function signOut(sessionId) {
    try {
        await removeSession({sessionId})
    } catch (error) {
        return error.message
    }
}

export async function isAuthenticated(sessionId) {
    try {
        const user = await findSession({sessionId})
        if (user)
            return true

    } catch (error) {
        return false
    }
}

// for debug
export async function getAllUsers() {
    try {
        return {users: await findAllUsers({}, {email: 1, _id: 0})}
    } catch (error) {
        return {error: error.message}
    }
}

// for debug
export async function getAllAuthenticatedUsers() {
    try {
        const users = await findAllSessions({}, {sessionId: 1, _id: 0})
        return {users}
    } catch (error) {
        return {error: error.message}
    }
}

//

function insertUser(data) {
    return new Promise((resolve, reject) => {
        usersDb.insert(data, (error, newDoc) => {
            if (error) reject(error)
            else resolve(newDoc)
        })
    })
}

function findUser(query) {
    return new Promise((resolve, reject) => {
        usersDb.findOne(query, (error, doc) => {
            if (error) reject(error)
            else resolve(doc)
        })
    })
}

function insertSession(data) {
    return new Promise((resolve, reject) => {
        authDb.insert(data, (error, newDoc) => {
            if (error) reject(error)
            else resolve(newDoc)
        })
    })
}

function removeSession(query) {
    return new Promise((resolve, reject) => {
        authDb.remove(query, {multi: false}, (error, numRemoved) => {
            if (error) reject(error)
            else resolve(numRemoved)
        })
    })
}

function findSession(query) {
    return new Promise((resolve, reject) => {
        authDb.findOne(query, (error, doc) => {
            if (error) reject(error)
            else resolve(doc)
        })
    })
}

function findAllUsers(query, projection) {
    return new Promise((resolve, reject) => {
        usersDb.find(query, projection, (error, docs) => {
            if (error) reject(error)
            else resolve(docs)
        })
    })
}

function findAllSessions(query, projection) {
    return new Promise((resolve, reject) => {
        authDb.find(query, projection, (error, docs) => {
            if (error) reject(error)
            else resolve(docs)
        })
    })
}