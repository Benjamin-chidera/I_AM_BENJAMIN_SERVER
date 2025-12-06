import pool from "../lib/connect";
import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { getPublicIdFromUrl } from "../lib/cloudinary_url";

export const createProfile = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { full_name, headline, location } = req.body;

    // Check if profile already exists
    const existing = await client.query("SELECT id FROM profile LIMIT 1");
    if ((existing?.rowCount ?? 0) > 0) {
      return res.status(409).json({
        success: false,
        error: "Profile already exists. Use PUT to update it.",
      });
    }

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

    const imageFile = Array.isArray(req.files.image)
      ? req.files.image[0]
      : req.files.image;

    const profileImage = await cloudinary.uploader.upload(
      imageFile.tempFilePath,
      {
        folder: "projects/profile_images",
        colors: true,
      }
    );

    const query =
      "INSERT INTO profile (full_name, headline, location, profile_image) VALUES ($1, $2, $3, $4) RETURNING *";

    const values = [full_name, headline, location, profileImage.secure_url];

    const result = await client.query(query, values);

    if (imageFile.tempFilePath && fs.existsSync(imageFile.tempFilePath)) {
      fs.unlinkSync(imageFile.tempFilePath);
    }

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM profile LIMIT 1");
    // Return single object or null, not array
    res.json(result.rows[0] ?? null);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { full_name, headline, location } = req.body;

    // Fetch the single profile (no id param)
    const oldProfile = await client.query(
      "SELECT profile_image FROM profile LIMIT 1"
    );

    console.log(oldProfile);
    

    if (oldProfile.rowCount === 0) {
      return res.status(404).json({ error: "Profile not found" }); 
    }

    let newImageUrl = oldProfile.rows[0].profile_image;

    // If user uploaded new image, replace it
    if (req.files?.image) {
      const imageFile = Array.isArray(req.files.image)
        ? req.files.image[0]
        : req.files.image;

      const uploadResult = await cloudinary.uploader.upload(
        imageFile.tempFilePath,
        { folder: "projects/profile_images" }
      );
      newImageUrl = uploadResult.secure_url;

      if (fs.existsSync(imageFile.tempFilePath)) {
        fs.unlinkSync(imageFile.tempFilePath);
      }

      // Delete old image from Cloudinary
      if (oldProfile.rows[0].profile_image) {
        const publicId = getPublicIdFromUrl(oldProfile.rows[0].profile_image);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updateQuery = `
      UPDATE profile
      SET full_name = $1, headline = $2, location = $3, profile_image = $4
      RETURNING *`;

    const values = [full_name, headline, location, newImageUrl];

    const result = await client.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    // Get the single profile (no id param needed)
    const profile = await client.query(
      "SELECT profile_image FROM profile LIMIT 1"
    );

    if (profile.rowCount === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const imageUrl = profile.rows[0].profile_image;

    // Delete from DB
    await client.query("DELETE FROM profile");

    // Delete image from Cloudinary
    if (imageUrl) {
      const publicId = getPublicIdFromUrl(imageUrl);
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
