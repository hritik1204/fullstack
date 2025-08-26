"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreview = getPreview;
const preview_service_1 = require("../services/preview.service");
async function getPreview(req, res, next) {
    try {
        const { url, raw_html } = req.body;
        if (!url) {
            return res.status(400).json({ error: "Missing URL" });
        }
        const data = await (0, preview_service_1.fetchPreview)(url, raw_html);
        res.json(data);
    }
    catch (err) {
        next(err); // Pass to error middleware
    }
}
