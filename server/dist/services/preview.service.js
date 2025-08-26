"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPreview = fetchPreview;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
const url_1 = require("url");
const ssrfGuard_1 = require("../utils/ssrfGuard");
async function fetchPreview(url, raw_html) {
    let parsedUrl;
    try {
        parsedUrl = new url_1.URL(url);
        if ((0, ssrfGuard_1.isPrivateIP)(parsedUrl.hostname)) {
            throw new Error("Blocked private IP");
        }
    }
    catch {
        throw new Error("Invalid URL");
    }
    let html;
    if (raw_html) {
        html = raw_html;
    }
    else {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await (0, node_fetch_1.default)(parsedUrl.href, {
            signal: controller.signal,
            headers: { "User-Agent": "CentscapeBot/1.0" },
            redirect: "follow",
            follow: 3
        });
        clearTimeout(timeout);
        if (!response.headers.get("content-type")?.includes("text/html")) {
            throw new Error("Not an HTML page");
        }
        html = await response.text();
        if (html.length > 512 * 1024) {
            throw new Error("HTML too large (>512 KB)");
        }
    }
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").text() ||
        "Untitled";
    const image = $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        $("img").first().attr("src") ||
        null;
    const price = $('meta[property="product:price:amount"]').attr("content") ||
        /\$\d+(\.\d{2})?/.exec(html)?.[0] ||
        null;
    const currency = $('meta[property="product:price:currency"]').attr("content") || null;
    const siteName = $('meta[property="og:site_name"]').attr("content") || parsedUrl.hostname;
    return {
        title,
        image,
        price,
        currency,
        siteName,
        sourceUrl: parsedUrl.href
    };
}
