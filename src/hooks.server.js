import {ROUTES_ADMIN_SHOULD_NOT_BE_AUTHENTICATED} from "$lib/js/server/constants/constants.server.js";
import {initMail} from "$lib/js/server/util/util.mail.server.js";
import {json, redirect} from "@sveltejs/kit";
import {minify} from "html-minifier";
import {createUser, getAllUsers, isAuthenticated} from "$lib/js/server/repository/users.nedb.repository.js";

await initMail()

const {users} = await getAllUsers()
if (users.length === 0)
    await createUser('a1@gmail.com', 'Pass1234')

export async function handle({event, resolve}) {
    // DEBUG
    // console.log("\n" + decodeURI(event.url.pathname + event.url.search))

    const result = await handleAuth(event)
    if (result)
        return result

    event.locals.search = event.url.search.substring(1, event.url.search.length)

    let page = ""
    return await resolve(
        event,
        {
            transformPageChunk: ({html, done}) => {
                page += html

                if (done)
                    return minify(
                        page,
                        {
                            collapseBooleanAttributes: true,
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            decodeEntities: true,
                            html5: true,
                            ignoreCustomComments: [/^#/],
                            minifyCSS: true,
                            minifyJS: true,
                            removeAttributeQuotes: true,
                            removeComments: false, // some hydration code needs comments, so leave them in
                            removeOptionalTags: true,
                            removeRedundantAttributes: true,
                            removeScriptTypeAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            sortAttributes: true,
                            sortClassName: true,
                        }
                    )
            }
        }
    )
}

async function handleAuth(event) {
    const pathname = decodeURI(event.url.pathname)

    if (pathname === '/yönetim-paneli' || pathname.includes('yönetim-paneli/')) {
        if (!await isAuthenticated(event.cookies.get('sessionId')))
            throw redirect(307, encodeURI("/panele-giriş-yap?yetkisiz"))

        event.locals.session = {authentication: 'AUTHENTICATED'}

        return
    }

    if (ROUTES_ADMIN_SHOULD_NOT_BE_AUTHENTICATED.has(pathname)) {
        const sessionId = event.cookies.get('sessionId-' + encodeURI(pathname))
        if (!(sessionId && await isAuthenticated(sessionId)))
            return

        if (event.isDataRequest)
            return json({error: 'Oturumunuz zaten açık.'}, {status: 401})

        throw redirect(307, encodeURI("/yönetim-paneli?oturumunuz-zaten-açık"))
    }

    event.session = {authentication: 'NOT_AUTHENTICATED'}
}
