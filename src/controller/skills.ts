import pool from "../lib/connect";
import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { getPublicIdFromUrl } from "../lib/cloudinary_url";

export const postSkills = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const {
      skills_name,
      skills_type, // this is for - FRONTEND, BACKEND, TOOLS, AI/ML
    } = req.body;

    // Validate image
    if (
      !req.files ||
      !req.files.image ||
      (Array.isArray(req.files.image) && req.files.image.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Please upload at least one image",
      });
    }

    // Handle single or multiple uploads
    const imageFile = Array.isArray(req.files.image)
      ? req.files.image[0]
      : req.files.image;

    // Upload to cloudinary
    const skill_img = await cloudinary.uploader.upload(imageFile.tempFilePath, {
      folder: "projects/skill_images",
      colors: true,
    });

    const query =
      "INSERT INTO skills (skills_name, skills_type, skills_img) values ($1, $2, $3) RETURNING *";

    const values = [skills_name, skills_type, skill_img.secure_url];

    const result = await client.query(query, values);

    // ❗ delete temporary file only
    if (imageFile.tempFilePath && fs.existsSync(imageFile.tempFilePath)) {
      fs.unlinkSync(imageFile.tempFilePath);
    }

    res.status(201).json({
      success: true,
      message: "Skills added successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getSkills = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM skills");

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateSkills = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { skills_name, skills_type } = req.body;

    const old = await client.query(
      "SELECT skills_img FROM skills WHERE id = $1",
      [id]
    );
    if (old.rowCount === 0)
      return res.status(404).json({ error: "Skill not found" });

    let newImageUrl = old.rows[0].skills_img;

    if (req.files?.image) {
      const imageFile = Array.isArray(req.files.image)
        ? req.files.image[0]
        : req.files.image;

      const upload = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "projects/skill_images",
      });
      newImageUrl = upload.secure_url;

      if (fs.existsSync(imageFile.tempFilePath))
        fs.unlinkSync(imageFile.tempFilePath);

      const publicId = old.rows[0].skills_img
        ? getPublicIdFromUrl(old.rows[0].skills_img)
        : null;
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const updateQuery = `
      UPDATE skills
      SET skills_name = $1, skills_type = $2, skills_img = $3
      WHERE id = $4 RETURNING *`;
    const values = [skills_name, skills_type, newImageUrl, id];

    const result = await client.query(updateQuery, values);
    res
      .status(200)
      .json({
        success: true,
        message: "Skills updated successfully",
        data: result.rows[0],
      });
  } finally {
    client.release();
  }
};

export const deleteSkills = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    const skill = await client.query(
      "SELECT skills_img FROM skills WHERE id = $1",
      [id]
    );
    if (skill.rowCount === 0)
      return res.status(404).json({ error: "Skill not found" });

    const imageUrl = skill.rows[0].skills_img;

    await client.query("DELETE FROM skills WHERE id = $1", [id]);

    const publicId = imageUrl ? getPublicIdFromUrl(imageUrl) : null;
    if (publicId) await cloudinary.uploader.destroy(publicId);

    res
      .status(200)
      .json({ success: true, message: "Skills deleted successfully" });
  } finally {
    client.release();
  }
};
