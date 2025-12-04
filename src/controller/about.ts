import pool from "../lib/connect";
import type { Request, Response } from "express";

export const postAbout = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { about_me } = req.body;

    const query = "INSERT INTO About(about_me) values ( $1 ) ";

    const values = [about_me];

    const result = await client.query(query, values);

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
    const result = await client.query("SELECT * FROM about");

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { about_me } = req.body;

    const query = "UPDATE About SET about_me = $1 WHERE id = $2 RETURNING *";

    const values = [about_me, id];

    const result = await client.query(query, values);

    res
      .status(200)
      .json({ message: "Aboutupdated successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
