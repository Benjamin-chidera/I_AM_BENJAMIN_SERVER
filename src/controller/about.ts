import pool from "../lib/connect";
import type { Request, Response } from "express";

export const postAbout = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { about_me } = req.body;
    if (!about_me)
      return res.status(400).json({ error: "about_me is required" });

    const existing = await client.query("SELECT id FROM about LIMIT 1");
    if ((existing.rowCount ?? 0) > 0) {
      return res
        .status(409)
        .json({ error: "About already exists. Use PUT to update it." });
    }

    const result = await client.query(
      "INSERT INTO about (about_me) VALUES ($1) RETURNING *",
      [about_me]
    );

    res
      .status(201)
      .json({ message: "About added successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getAbout = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM about LIMIT 1");
    res.json(result.rows[0] ?? null);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { about_me } = req.body;
    if (!about_me)
      return res.status(400).json({ error: "about_me is required" });

    const existing = await client.query("SELECT id FROM about LIMIT 1");
    if ((existing.rowCount ?? 0) === 0) {
      return res.status(404).json({ error: "About not found" });
    }

    const result = await client.query(
      "UPDATE about SET about_me = $1 RETURNING *",
      [about_me]
    );

    res
      .status(200)
      .json({ message: "About updated successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const deleteAbout = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const existing = await client.query("SELECT id FROM about LIMIT 1");
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "About not found" });
    }

    await client.query("DELETE FROM about");
    res.status(200).json({ message: "About deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
