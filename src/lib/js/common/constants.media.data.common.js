export const ARTICLE_IMAGE_ASPECT_RATIO = [1, 1]

export const ARTICLE_IMAGE_MEDIA_DATA = constructMediaDataLinear({
        maxPixelDensity: 4,
        breakpointCount: 1,
        photoMaxWidth: 320,
        photoMinWidth: 320,
        minWidth: 1040,
        maxWidth: 9999,
    })
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 1,
                photoMaxWidth: 301,
                photoMinWidth: 301,
                minWidth: 812,
                maxWidth: 1040,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 1,
                photoMaxWidth: 350,
                photoMinWidth: 350,
                minWidth: 462,
                maxWidth: 812,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 8,
                photoMaxWidth: 350,
                photoMinWidth: 208,
                maxWidth: 462,
            })
        ),
    BIG_ARTICLE_IMAGE_MEDIA_DATA = constructMediaDataLinear({
        maxPixelDensity: 4,
        breakpointCount: 1,
        photoMaxWidth: 440,
        photoMinWidth: 440,
        minWidth: 1040,
        maxWidth: 9999,
    })
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 1,
                photoMaxWidth: 385,
                photoMinWidth: 385,
                minWidth: 812,
                maxWidth: 1040,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 1,
                photoMaxWidth: 350,
                photoMinWidth: 350,
                minWidth: 462,
                maxWidth: 812,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 8,
                photoMaxWidth: 350,
                photoMinWidth: 208,
                maxWidth: 462,
            })
        ),
    PAGE_ARTICLE_IMAGE_MEDIA_DATA = constructMediaDataLinear({
        maxPixelDensity: 4,
        breakpointCount: 1,
        photoMaxWidth: 720,
        photoMinWidth: 720,
        minWidth: 1256,
        maxWidth: 9999,
    })
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 8,
                photoMaxWidth: 720,
                photoMinWidth: 505.33,
                minWidth: 1041,
                maxWidth: 1256,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 1,
                photoMaxWidth: 630,
                photoMinWidth: 630,
                minWidth: 672,
                maxWidth: 1041,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 12,
                photoMaxWidth: 630,
                photoMinWidth: 278,
                maxWidth: 672,
            })
        ),
    ABOUT_ME_IMAGE_MEDIA_DATA = constructMediaDataLinear({
        maxPixelDensity: 4,
        breakpointCount: 1,
        photoMaxWidth: 720,
        photoMinWidth: 720,
        minWidth: 1040,
        maxWidth: 9999,
    })
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 1,
                photoMaxWidth: 630,
                photoMinWidth: 630,
                minWidth: 672,
                maxWidth: 1040,
            })
        )
        .concat(
            constructMediaDataLinear({
                maxPixelDensity: 4,
                breakpointCount: 12,
                photoMaxWidth: 630,
                photoMinWidth: 278,
                maxWidth: 672,
            })
        )

function constructMediaDataLinear({
                                             maxPixelDensity,
                                             breakpointCount,
                                             photoMaxWidth,
                                             photoMinWidth,
                                             lastMaxWidth,
                                             maxWidth,
                                             minWidth = 320
                                         }) {

    const mediaData = [],
        queryGap = (maxWidth - minWidth) / breakpointCount,
        photoGap = (photoMaxWidth - photoMinWidth) / breakpointCount

    for (let density = 1; density < maxPixelDensity + 1; density++)
        for (let breakpoint = 0; breakpoint < breakpointCount; breakpoint++)
            mediaData.push({
                density,
                maxWidth: lastMaxWidth && breakpoint === 0 ? lastMaxWidth : maxWidth - queryGap * breakpoint,
                minWidth:
                    breakpoint === breakpointCount - 1 && minWidth === 320 ? 320 : maxWidth - queryGap * (breakpoint + 1) + 0.1,
                photoWidth: Math.round((photoMaxWidth - photoGap * breakpoint) * density),
            })

    return mediaData
}