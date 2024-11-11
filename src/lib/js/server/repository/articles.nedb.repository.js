import Datastore from 'nedb'
import { arrayToJSON, toJSON } from './util.repository.js'

const db = new Datastore({ filename: 'db/articles.db', autoload: true, timestampData: true })

db.ensureIndex({ fieldName: 'title', unique: true })
db.persistence.setAutocompactionInterval(60000)

export async function createArticle(article) {
    const { title, firstSentence, content, imageName, imageUpdatedAt } = article
    try {
        await insert({ title, firstSentence, content, imageName, imageUpdatedAt })
    } catch (error) {
        return error.message
    }
}

export async function getArticle(title) {
    try {
        return { article: toJSON(await findOne({ title }, { createdAt: -1, updatedAt: -1 })) }
    } catch (error) {
        return { error: error.message }
    }
}

export async function getArticleImageName(id) {
    try {
        const article = await findOne({ _id: id }, { imageName: 1 })
        if (!article)
            return { error: 'Makale bulunamadı.' }

        return { imageName: article.imageName }
    } catch (error) {
        return { error: error.message }
    }
}

export async function getArticleTitleAndImageNameAndImageUpdatedAt(id) {
    try {
        const article = await findOne({ _id: id }, { title: 1, imageName: 1, imageUpdatedAt: 1 })
        if (!article)
            return { error: 'Makale bulunamadı.' }

        return { article: toJSON(article) }
    } catch (error) {
        return { error: error.message }
    }
}

export async function getArticleAndTwoSimilarArticles(title) {
    try {
        const article = await findOne({ title }, { _id: 0 })
        if (!article)
            return { error: 'Makale bulunamadı.' }

        return { article: toJSON(article), similarArticles: arrayToJSON(await find({ title: { $ne: title } }, { _id: 0, title: 1, firstSentence: 1, imageName: 1, imageUpdatedAt: 1 }, { limit: 2 })) }
    } catch (error) {
        return { error: error.message }
    }
}

export async function getMaxThreeArticles() {
    try {
        return { articles: arrayToJSON(await find({}, { _id: 0, title: 1, firstSentence: 1, imageName: 1, imageUpdatedAt: 1 }, { sort: { createdAt: -1 }, limit: 3 })) }
    } catch (error) {
        return { error: error.message }
    }
}

export async function getAllArticles() {
    try {
        return { articles: arrayToJSON(await find({}, { _id: 0, title: 1, firstSentence: 1, imageName: 1, imageUpdatedAt: 1 }, { sort: { createdAt: -1 } })) }

    } catch (error) {
        return { error: error.message }
    }
}

export async function getAllArticlesForPanel() {
    try {
        return { articles: arrayToJSON(await find({}, { _id: 1, title: 1, firstSentence: 1, imageName: 1, imageUpdatedAt: 1 }, { sort: { createdAt: -1 } })) }

    } catch (error) {
        return { error: error.message }
    }
}

export async function getAllArticlesForSitemap() {
    try {
        return { articles: arrayToJSON(await find({}, { _id: 0, title: 1, updatedAt: 1 }, { sort: { createdAt: -1 } })) }

    } catch (error) {
        return { error: error.message }
    }
}

export async function removeArticle(id) {
    try {
        await remove({ _id: id }, {})
    } catch (error) {
        return error.message
    }
}

export async function editArticle(id, article) {
    const { title, firstSentence, content, imageName, imageUpdatedAt } = article
    try {
        await update({ _id: id }, { $set: { title, firstSentence, content, imageName, imageUpdatedAt } }, {})
    } catch (error) {
        return error.message
    }
}

//

function insert(data) {
    return new Promise((resolve, reject) => {
        db.insert(data, (err, newDoc) => {
            if (err) reject(err)
            else resolve(newDoc)
        })
    })
}

function findOne(query, projection) {
    return new Promise((resolve, reject) => {
        db.findOne(query, projection, (err, doc) => {
            if (err) reject(err)
            else resolve(doc)
        })
    })
}

function find(query, projection, options = {}) {
    return new Promise((resolve, reject) => {
        let cursor = db.find(query, projection)

        if (options.limit)
            cursor = cursor.limit(options.limit)

        if (options.sort)
            cursor.sort(options.sort)

        cursor.exec((error, docs) => {
            if (error) reject(error)
            else resolve(docs)
        })
    })
}

function remove(query, options) {
    return new Promise((resolve, reject) => {
        db.remove(query, options, (err, numRemoved) => {
            if (err) reject(err)
            else resolve(numRemoved)
        })
    })
}

function update(query, update, options) {
    return new Promise((resolve, reject) => {
        db.update(query, update, options, (err, numReplaced) => {
            if (err) reject(err)
            else resolve(numReplaced)
        })
    })
}