import sizeOf from 'buffer-image-size'
import {createReadStream, existsSync, promises as fs, readdirSync} from 'fs'
import sharp from 'sharp'

const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
}

export function sendImage(req, res) {
    const url = new URL(req.url, 'http://somewebsite.com'),
        folderName = decodeURI(url.pathname).replace('/api/', '')

    if (url.searchParams.get('send-smallest')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        res.setHeader('Content-Type', 'image/webp')

        createReadStream(folderName + '/' + readdirSync(folderName)[0]).pipe(res)

        return
    }

    if (url.searchParams.get('send-biggest')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        res.setHeader('Content-Type', 'image/webp')

        const fileNames = readdirSync(folderName)

        createReadStream(folderName + '/' + fileNames[fileNames.length - 1]).pipe(res)

        return
    }

    let imagePath = folderName

    if (imagePath.endsWith('/'))
        imagePath = imagePath.substring(0, imagePath.length - 1)

    const extension = imagePath.substring(imagePath.lastIndexOf('.'), imagePath.length)
    if (extension !== '.svg')
        imagePath += '/' + url.search + extension

    if (existsSync(imagePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        res.setHeader('Content-Type', getMimeType(extension))

        createReadStream(imagePath).pipe(res)

        return
    }

    if (!existsSync(folderName))
        return res.sendStatus(404)

    const imagesPaths = readdirSync(folderName),
        ratio = url.searchParams.get('ratio')

    if (ratio)
        for (let i = imagesPaths.length - 1; i > 0; i--) {
            const imagePath = imagesPaths[i],
                // bunda sıkıntı çıkarsa, .replace('.webp', '') ekle
                _ratio = imagePath.split('&')[2].split('=')[1]

            if (ratio === _ratio) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
                res.setHeader('Content-Type', getMimeType(extension))
                createReadStream(folderName + '/' + imagePath).pipe(res)

                return
            }
        }

    let maxWidth = 0,
        maxWidthPath

    for (const image of imagesPaths) {
        const width = Number(image.split('&')[1].split('=')[1].replace('.webp', ''))

        if (width > maxWidth) {
            maxWidth = width
            maxWidthPath = image
        }
    }

    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Content-Type', getMimeType(extension))
    createReadStream(folderName + '/' + maxWidthPath).pipe(res)
}

export async function saveImage(imageName, mediaData, image, updatedAt, onceRatio) {
    try {
        if (image.type.includes('svg')) {
            await fs.writeFile('image/' + imageName + '.svg', await getImageBuffer(image))

            return {extension: '.svg'}
        }

        const untilSaved = [],
            imageBuffer = await getImageBuffer(image),
            targetPath = await adjustAndGetTargetDirectory(imageName),
            actualWidth = sizeOf(imageBuffer).width

        for (const media of mediaData) {
            const options = getOptions(media, actualWidth, targetPath, updatedAt, onceRatio)
            if (!options)
                continue

            let _resolve
            untilSaved.push(new Promise((resolve) => (_resolve = resolve)))

            sharp(imageBuffer)
                .webp({quality: 40, alphaQuality: 50})
                .resize(options.resizeOptions)
                .toFile(options.filePath)
                .then(_resolve)
                .catch(error => console.error('util.image.server: saveImage > sharp:', error))
        }

        await Promise.all(untilSaved)

        return {extension: '.webp'}
    } catch (error) {
        console.error('util.image.server: saveImage:', error)

        return {error: error.message}
    }
}

async function getImageBuffer(image) {
    return Buffer.from(new Uint8Array(await image.arrayBuffer()))
}

async function adjustAndGetTargetDirectory(imageName) {
    const targetPath = 'image/' + imageName + '.webp'

    if (!existsSync(targetPath))
        await fs.mkdir(targetPath)

    return targetPath + '/'
}

function getOptions(media, actualWidth, targetPath, updatedAt, onceRatio) {
    const photoWidth = media.photoWidth

    if (photoWidth > actualWidth)
        return

    let filePath = targetPath + '?' + 'density=' + media.density + '&width=' + photoWidth,
        resizeOptions = {width: photoWidth, withoutEnlargement: true}

    if (media.aspectRatio) {
        resizeOptions.height = Math.round((media.aspectRatio[1] * photoWidth) / media.aspectRatio[0])

        if (!onceRatio)
            filePath += '&ratio=' + media.aspectRatio[0] + '-' + media.aspectRatio[1]
    }

    if (updatedAt)
        filePath += '&updated-at=' + updatedAt + '.webp'
    else
        filePath += '.webp'

    return {resizeOptions, filePath}
}

export function getMimeType(extension) {
    return mimeTypes[extension] || 'application/octet-stream';
}

export async function removeImages(imageName) {
    try {
        await fs.rm('image/' + imageName, {recursive: true, force: true})
    } catch (error) {
        console.error('util.image.server: removeImages:', error)

        return error.message
    }
}

export async function changeImageName(oldImageName, newImageName) {
    try {
        await fs.rename('image/' + oldImageName, 'image/' + newImageName)
    } catch (error) {
        console.error('util.image.server: changeImageName:', error)

        return error.message
    }
}