﻿import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:7003',
            changeOrigin: true,
            secure: false
        })
    );
}