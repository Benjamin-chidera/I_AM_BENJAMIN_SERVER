import pool from "../lib/connect.ts";
import type { Request, Response } from "express";

const client = await pool.connect();

export const getSocial = async (req: Request, res: Response) => {
  try {
    const result = await client.query("SELECT * FROM resume");

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
