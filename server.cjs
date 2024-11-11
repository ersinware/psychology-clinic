const express = require("express"),
    app = express(),
    corsOptions = {origin: 'https://zeynepbasar.com.tr'},
    cors = require("cors"),
    helmet = require("helmet"),
    compress = require("http-compression")

process.env['BODY_SIZE_LIMIT'] = 10485760;

(async () => {
    const {handler} = await import('./build/handler.js'),
        {sendImage} = await import('./src/lib/js/server/util/util.image.server.js')

    app
        .options("*", cors(corsOptions))
        .use(cors(corsOptions))
        .use(
            helmet({
                contentSecurityPolicy: false,
                referrerPolicy: {policy: "strict-origin-when-cross-origin"},
                strictTransportSecurity: {preload: true},
                xDnsPrefetchControl: {allow: true},
                xFrameOptions: {action: "deny"},
                crossOriginEmbedderPolicy: {policy: "unsafe-none"},
            })
        )
        .get("/api/image/:imageName", sendImage)
        .use(compress())
        .use("/", express.static("static", {immutable: true, maxAge: 31556926000, index: false}))
        .use(handler)
        .listen(3000, () => console.log('onConnect'))
})()
