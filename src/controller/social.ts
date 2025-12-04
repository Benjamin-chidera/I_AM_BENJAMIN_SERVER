import pool from "../lib/connect";
import type { Request, Response } from "express";

export const postSocial = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { platform_name, handle, url } = req.body;

    const query =
      "INSERT INTO social (platform_name, handle, url) values ( $1, $2, $3 ) ";

    const values = [platform_name, handle, url];

    const result = await client.query(query, values);

    res
      .status(201)
      .json({ message: "Social added successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getSocial = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM social");

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const deleteSocial = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const query = "DELETE FROM social WHERE id = $1";

    const values = [id];

    await client.query(query, values);

    res.status(200).json({ message: "social deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateSocial = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { platform_name, handle, url } = req.body;

    const query =
      "UPDATE social SET platform_name = $1, handle = $2, url = $3 WHERE id = $4 RETURNING *";

    const values = [platform_name, handle, url, id];

    const result = await client.query(query, values);

    res
      .status(200)
      .json({ message: "Social updated successfully", data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
