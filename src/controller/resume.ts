import pool from "../lib/connect";
import type { Request, Response } from "express";

export const postResume = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    // Check if resume already exists
    const existing = await client.query("SELECT id FROM resume LIMIT 1");
    if ((existing.rowCount ?? 0) > 0) {
      return res.status(409).json({
        error: "Resume already exists. Use PUT to update it.",
      });
    }

    const query = "INSERT INTO resume (url) VALUES ($1) RETURNING *";
    const values = [url];

    const result = await client.query(query, values);

    res.status(201).json({
      message: "Resume added successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getResume = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM resume LIMIT 1");
    // Return single object or null, not array
    res.json(result.rows[0] ?? null);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateResume = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    // Check if resume exists
    const existing = await client.query("SELECT id FROM resume LIMIT 1");
    if ((existing.rowCount ?? 0) === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const query = "UPDATE resume SET url = $1 RETURNING *";
    const values = [url];

    const result = await client.query(query, values);

    res.status(200).json({
      message: "Resume updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    // Check if resume exists
    const existing = await client.query("SELECT id FROM resume LIMIT 1");
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    await client.query("DELETE FROM resume");

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
