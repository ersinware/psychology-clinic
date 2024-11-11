import { getAllArticlesForSitemap } from "$lib/js/server/repository/articles.nedb.repository.js";
import {formatDateToISOWithOffset, getDashedString} from "$lib/js/common/util.common.js";

export async function GET() {
    const { articles, error } = await getAllArticlesForSitemap()

    return new Response(
        `<?xml version="1.0" encoding="UTF-8" ?>
        <urlset
          xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="https://www.w3.org/1999/xhtml"
          xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
          xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
          xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
          xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
            <url>
                <loc>https://zeynepbasar.com.tr</loc>
                <lastmod>2024-08-09T09:58:51+03:00</lastmod>
            </url>

             <url>
                <loc>https://zeynepbasar.com.tr/makaleler</loc>
                <lastmod>2024-08-09T09:58:51+03:00</lastmod>
            </url>

             <url>
                <loc>https://zeynepbasar.com.tr/hakkımda</loc>
                <lastmod>2024-08-09T09:58:51+03:00</lastmod>
            </url>

             <url>
                <loc>https://zeynepbasar.com.tr/iletişim</loc>
                <lastmod>2024-08-09T09:58:51+03:00</lastmod>
            </url>

            ${!error ? getArticles(articles) : ''}
        </urlset>`.trim(),
        { headers: { 'Content-Type': 'application/xml' } }
    )
}

function getArticles(articles) {
    let all = ''

    for (const article of articles)
        all += `
            <url>
                <loc>https://zeynepbasar.com.tr/makale/${getDashedString(article.title)}</loc>
                <lastmod>${formatDateToISOWithOffset(article.updatedAt)}</lastmod>
            </url>
        `

    return all
}
