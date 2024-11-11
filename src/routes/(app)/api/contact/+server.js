import { sendMail } from "$lib/js/server/util/util.mail.server.js";
import { json } from "@sveltejs/kit";

export async function PUT({ request }) {
    const { thoughts, name, surname, email, phone } = await request.json()

    await sendMail(`
        <p>${thoughts}</p>

        <br/>

        <p>${name} ${surname ?? ''}</p>

        <p>${email ?? ''} ${phone ?? ''}</p>
    `)

    return json({}, { status: 200 })
}