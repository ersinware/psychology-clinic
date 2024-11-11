import {json} from "@sveltejs/kit";
import {ROUTES_ADMIN_SHOULD_NOT_BE_AUTHENTICATED} from "$lib/js/server/constants/constants.server.js";
import { signOut } from "$lib/js/server/repository/users.nedb.repository.js";

export async function PUT({cookies}) {
    const error = await signOut(cookies.get('sessionId'))
    if (error)
        return json({error}, {status: 400})

    cookies.set(
        "sessionId",
        '',
        {
            path: encodeURI("/yönetim-paneli"),
            maxAge: -1
        }
    )

    for (const path of ROUTES_ADMIN_SHOULD_NOT_BE_AUTHENTICATED.keys()) {
        cookies.set(
            "sessionId-" + encodeURI(path),
            '',
            {
                path: encodeURI(path),
                maxAge: -1
            }
        )
    }

    return json({}, {status: 200})
}