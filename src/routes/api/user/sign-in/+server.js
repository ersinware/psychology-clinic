import {json} from "@sveltejs/kit";
import {ROUTES_ADMIN_SHOULD_NOT_BE_AUTHENTICATED} from "$lib/js/server/constants/constants.server.js";
import { signIn } from "$lib/js/server/repository/users.nedb.repository.js";

export async function PUT({request, cookies}) {
    const {email, password} = await request.json(),
        {sessionId, error} = await signIn(email, password)

    if (error)
        return json({error}, {status: 401})

    const options = {
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 34560000
    }

    cookies.set(
        "sessionId",
        sessionId,
        {
            path: encodeURI("/yönetim-paneli"),
            ...options
        }
    )

    for (const path of ROUTES_ADMIN_SHOULD_NOT_BE_AUTHENTICATED.keys()) {
        cookies.set(
            "sessionId-" + encodeURI(path),
            sessionId,
            {
                path: encodeURI(path),
                ...options
            }
        )
    }

    return json({}, {status: 200})
}