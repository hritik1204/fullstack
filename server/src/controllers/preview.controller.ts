import { Request, Response, NextFunction } from "express";
import { fetchPreview } from "../services/preview.service";


export async function getPreview(req: Request, res: Response, next: NextFunction) {
  try {
    const { url, raw_html } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing URL" });
    }

    const data = await fetchPreview(url, raw_html);
    res.json(data);
  } catch (err) {
    next(err); // Pass to error middleware
  }
}
