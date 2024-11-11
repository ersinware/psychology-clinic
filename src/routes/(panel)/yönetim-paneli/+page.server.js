import { SEARCH_PARAM_FOR_UNKNOWN_ERROR } from "$lib/js/common/constants.common";
import { getAllArticlesForPanel } from "$lib/js/server/repository/articles.nedb.repository.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
    const { articles, error } = await getAllArticlesForPanel()
    if (error && locals.search !== SEARCH_PARAM_FOR_UNKNOWN_ERROR)
        throw redirect(307, "/?" + SEARCH_PARAM_FOR_UNKNOWN_ERROR)

    return { articles }
}