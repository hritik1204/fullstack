import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { URL } from "url";
import { isPrivateIP } from "../utils/ssrfGuard";

export async function fetchPreview(url: string, raw_html?: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
    if (isPrivateIP(parsedUrl.hostname)) {
      throw new Error("Blocked private IP");
    }
  } catch {
    throw new Error("Invalid URL");
  }

  let html: string;

  if (raw_html) {
    html = raw_html;
  } else {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(parsedUrl.href, {
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

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text() ||
    "Untitled";

  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $("img").first().attr("src") ||
    null;

  const price =
    $('meta[property="product:price:amount"]').attr("content") ||
    /\$\d+(\.\d{2})?/.exec(html)?.[0] ||
    null;

  const currency =
    $('meta[property="product:price:currency"]').attr("content") || null;

  const siteName =
    $('meta[property="og:site_name"]').attr("content") || parsedUrl.hostname;

  return {
    title,
    image,
    price,
    currency,
    siteName,
    sourceUrl: parsedUrl.href
  };
}
