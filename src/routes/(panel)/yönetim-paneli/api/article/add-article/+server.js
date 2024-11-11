import { capitalizeFirstLetterOnly, getDashedString, waitFor } from "$lib/js/common/util.common.js";
import { ARTICLE_IMAGE_MEDIA_DATA_FOR_INSERT } from "$lib/js/server/constants/constants.media.data.server.js";
import { createArticle } from "$lib/js/server/repository/articles.nedb.repository.js";
import { removeImages, saveImage } from "$lib/js/server/util/util.image.server.js";
import { capitalizeWords } from "$lib/js/server/util/util.server.js";
import { json } from "@sveltejs/kit";

export async function PUT({ request }) {
    save(await request.formData())

    return json({}, { status: 200 })
}

async function save(formData) {
    console.log('save')
    await waitFor(2500)

    const { title, firstSentence, content } = JSON.parse(formData.get('article')),
        imageName = getDashedString(title),
        now = Date.now()

    const {
        extension,
        error
    } = await saveImage(imageName, ARTICLE_IMAGE_MEDIA_DATA_FOR_INSERT, formData.get('image'), now, true)
    if (error)
        return

    const _error = await createArticle({
        title: capitalizeWords(title),
        firstSentence: capitalizeFirstLetterOnly(firstSentence),
        content: capitalizeFirstLetterOnly(content),
        imageName: imageName + extension,
        imageUpdatedAt: now
    })

    if (_error)
        removeImages(imageName + extension)
}