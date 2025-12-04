import pool from "../lib/connect.ts";
import type { Request, Response } from "express";

export const postResume = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { url } = req.body;

    const query = "INSERT INTO resume (url) values ( $1 ) ";

    const values = [url];

    const result = await client.query(query, values);

    res
      .status(201)
      .json({ message: "Resume added successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getResume = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM resume");

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
 
    const query = "DELETE FROM resume WHERE id = $1";

    const values = [id];

    await client.query(query, values);

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateResume = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { url } = req.body;

    const query = "UPDATE resume SET url = $1 WHERE id = $2 RETURNING *";

    const values = [url, id];

    const result = await client.query(query, values);

    res
      .status(200)
      .json({ message: "Resume updated successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
