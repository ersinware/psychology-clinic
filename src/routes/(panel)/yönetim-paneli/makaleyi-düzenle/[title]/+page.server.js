import { SEARCH_PARAM_FOR_UNKNOWN_ERROR } from "$lib/js/common/constants.common";
import { getArticle } from "$lib/js/server/repository/articles.nedb.repository.js";
import { redirect } from "@sveltejs/kit";
import { getUndashedString } from "$lib/js/server/util/util.server.js";

export async function load({ params, locals }) {
    const { article, error } = await getArticle(getUndashedString(params.title))
    if (error && locals.search !== SEARCH_PARAM_FOR_UNKNOWN_ERROR)
        throw redirect(307, "/?" + SEARCH_PARAM_FOR_UNKNOWN_ERROR)

    return { article }
}