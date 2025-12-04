"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSkills = exports.updateSkills = exports.getSkills = exports.postSkills = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const cloudinary_url_1 = require("../lib/cloudinary_url");
const postSkills = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { skills_name, skills_type, // this is for - FRONTEND, BACKEND, TOOLS, AI/ML
         } = req.body;
        // Validate image
        if (!req.files ||
            !req.files.image ||
            (Array.isArray(req.files.image) && req.files.image.length === 0)) {
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
        const skill_img = await cloudinary_1.v2.uploader.upload(imageFile.tempFilePath, {
            folder: "projects/skill_images",
            colors: true,
        });
        const query = "INSERT INTO skills (skills_name, skills_type, skills_img) values ($1, $2, $3) RETURNING *";
        const values = [skills_name, skills_type, skill_img.secure_url];
        const result = await client.query(query, values);
        // ❗ delete temporary file only
        if (imageFile.tempFilePath && fs_1.default.existsSync(imageFile.tempFilePath)) {
            fs_1.default.unlinkSync(imageFile.tempFilePath);
        }
        res.status(201).json({
            success: true,
            message: "Skills added successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.postSkills = postSkills;
const getSkills = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM skills");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getSkills = getSkills;
const updateSkills = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { skills_name, skills_type } = req.body;
        // 1. Fetch old project
        const oldProject = await client.query("SELECT skills_img FROM skills WHERE id = $1", [id]);
        if (oldProject.rowCount === 0) {
            return res.status(404).json({ error: "Skill not found" });
        }
        let newImageUrl = oldProject.rows[0].skill_img;
        // 2. If user uploaded new image ➝ replace it
        if (req.files?.image) {
            const imageFile = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;
            // Upload new image
            const skills_img = await cloudinary_1.v2.uploader.upload(imageFile.tempFilePath, { folder: "projects/skill_images" });
            newImageUrl = skills_img.secure_url;
            // Delete temp file
            if (fs_1.default.existsSync(imageFile.tempFilePath)) {
                fs_1.default.unlinkSync(imageFile.tempFilePath);
            }
            // Delete old image from Cloudinary
            const publicId = (0, cloudinary_url_1.getPublicIdFromUrl)(oldProject.rows[0].project_image);
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        // 3. Update DB
        const updateQuery = `
      UPDATE skills SET skills_name = $1, skills_type = $2, skills_img = $3 WHERE id = $4 RETURNING *`;
        const values = [skills_name, skills_type, newImageUrl, id];
        const result = await client.query(updateQuery, values);
        res.status(200).json({
            success: true,
            message: "Skills updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.updateSkills = updateSkills;
const deleteSkills = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        // Get project to extract image URL
        const project = await client.query("SELECT skills_img FROM skills WHERE id = $1", [id]);
        if (project.rowCount === 0) {
            return res.status(404).json({ error: "Skill not found" });
        }
        const imageUrl = project.rows[0].skill_img;
        // Delete from DB
        await client.query("DELETE FROM skills WHERE id = $1", [id]);
        // Delete image from Cloudinary
        const publicId = (0, cloudinary_url_1.getPublicIdFromUrl)(imageUrl);
        await cloudinary_1.v2.uploader.destroy(publicId);
        res.status(200).json({
            success: true,
            message: "Skills deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.deleteSkills = deleteSkills;
