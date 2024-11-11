import { getArticleAndTwoSimilarArticles } from "$lib/js/server/repository/articles.nedb.repository.js";
import { getUndashedString } from "$lib/js/server/util/util.server.js";
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const { article, similarArticles, error: _error } = await getArticleAndTwoSimilarArticles(getUndashedString(params.title))
    if (_error)
        return error(404, { message: _error });

    return { article, similarArticles }
}