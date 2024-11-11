import {json} from "@sveltejs/kit";
import {removeImages} from "$lib/js/server/util/util.image.server.js";
import { getArticleImageName, removeArticle } from "$lib/js/server/repository/articles.nedb.repository.js";

export async function DELETE({request}) {
    const id = await request.text(),
        imageName = (await getArticleImageName(id)).imageName,
        error = await removeArticle(id)

    if (error)
        return json({error}, {status: 404})

    removeImages(imageName)

    return json({}, {status: 200})
}