import {
    ARTICLE_IMAGE_ASPECT_RATIO,
    ARTICLE_IMAGE_MEDIA_DATA,
    BIG_ARTICLE_IMAGE_MEDIA_DATA,
    PAGE_ARTICLE_IMAGE_MEDIA_DATA
} from '../../common/constants.media.data.common.js'

export const ARTICLE_IMAGE_MEDIA_DATA_FOR_INSERT =
    buildMediaData(
        [
            ...ARTICLE_IMAGE_MEDIA_DATA,
            ...BIG_ARTICLE_IMAGE_MEDIA_DATA,
            ...PAGE_ARTICLE_IMAGE_MEDIA_DATA
        ],
        ARTICLE_IMAGE_ASPECT_RATIO
    )

function buildMediaData(current, aspectRatio) {
    const previousWidths = new Set(),
        target = []

    for (const media of current) {
        if (previousWidths.has(media.photoWidth)) continue

        previousWidths.add(media.photoWidth)
        target.push({
            density: media.density,
            photoWidth: media.photoWidth,
            aspectRatio,
        })
    }

    return target
}