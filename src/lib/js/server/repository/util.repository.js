export function toJSON(object) {
    if (!object)
        return

    if (object._id) {
        object.id = object._id

        delete object._id
    }

    return object
}

export function arrayToJSON(array) {
    return array.map(object => toJSON(object))
}