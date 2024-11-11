import { getMimeType } from "$lib/js/server/util/util.image.server.js";
import { createReadStream, existsSync, readdirSync } from 'fs';

/* THIS IS ONLY FOR DEVELOPMENT MODE */

/* FOR PRODUCTION, THERE IS A MIDDLEWARE */

export function GET({ url, setHeaders }) {
    const folderName = decodeURI(url.pathname).replace('/api/', '')

    if (url.searchParams.get('send-smallest')) {
        setHeaders({ 'Cache-Control': 'public, max-age=31536000, immutable' })

        return new Response(createReadStream(folderName + '/' + readdirSync(folderName)[0]))
    }

    if (url.searchParams.get('send-biggest')) {
        setHeaders({ 'Cache-Control': 'public, max-age=31536000, immutable' })

        const fileNames = readdirSync(folderName)
        
        return new Response(createReadStream(folderName + '/' + fileNames[fileNames.length - 1]))
    }

    let imagePath = folderName

    if (imagePath.endsWith('/'))
        imagePath = imagePath.substring(0, imagePath.length - 1)

    const extension = imagePath.substring(imagePath.lastIndexOf('.'), imagePath.length)
    if (extension !== '.svg')
        imagePath += '/' + url.search + extension

    if (existsSync(imagePath)) {
        setHeaders({
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Type': getMimeType(extension)
        })

        return new Response(createReadStream(imagePath))
    }

    if (!existsSync(folderName))
        return new Response(null, { status: 404 })

    const imagesPaths = readdirSync(folderName),
        ratio = url.searchParams.get('ratio')

    if (ratio)
        for (let i = imagesPaths.length - 1; i > 0; i--) {
            const imagePath = imagesPaths[i],
                _ratio = imagePath.split('&')[2].split('=')[1]

            if (ratio === _ratio) {
                setHeaders({
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'Content-Type': getMimeType(extension)
                })

                return new Response(createReadStream(folderName + '/' + imagePath))
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

    setHeaders({
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': getMimeType(extension)
    })

    return new Response(createReadStream(folderName + '/' + maxWidthPath))
}