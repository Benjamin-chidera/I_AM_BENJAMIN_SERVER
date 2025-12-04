"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjects = exports.postProjects = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const cloudinary_url_1 = require("../lib/cloudinary_url");
const postProjects = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { title, description, github_url, live_url, project_status, tools_used, } = req.body;
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
        const resultImage = await cloudinary_1.v2.uploader.upload(imageFile.tempFilePath, {
            folder: "projects/project_images",
            colors: true,
        });
        const query = "INSERT INTO projects (title, description, github_url, live_url, project_status, tools_used, project_image) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const values = [
            title,
            description,
            github_url,
            live_url,
            project_status,
            tools_used,
            resultImage.secure_url,
        ];
        const result = await client.query(query, values);
        // ❗ delete temporary file only
        if (imageFile.tempFilePath && fs_1.default.existsSync(imageFile.tempFilePath)) {
            fs_1.default.unlinkSync(imageFile.tempFilePath);
        }
        res.status(201).json({
            success: true,
            message: "Project added successfully",
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
exports.postProjects = postProjects;
const getProjects = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM projects");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getProjects = getProjects;
const updateProject = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { title, description, github_url, live_url, project_status, tools_used } = req.body;
        // 1. Fetch old project
        const oldProject = await client.query("SELECT project_image FROM projects WHERE id = $1", [id]);
        if (oldProject.rowCount === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        let newImageUrl = oldProject.rows[0].project_image;
        // 2. If user uploaded new image ➝ replace it
        if (req.files?.image) {
            const imageFile = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;
            // Upload new image
            const uploadResult = await cloudinary_1.v2.uploader.upload(imageFile.tempFilePath, { folder: "projects/project_images",
            });
            newImageUrl = uploadResult.secure_url;
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
      UPDATE projects
      SET title = $1, description = $2, github_url = $3, live_url = $4, project_status = $5, tools_used = $6, project_image = $7
      WHERE id = $8 RETURNING *`;
        const values = [
            title,
            description,
            github_url,
            live_url,
            project_status,
            tools_used,
            newImageUrl,
            id,
        ];
        const result = await client.query(updateQuery, values);
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
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
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        // Get project to extract image URL
        const project = await client.query("SELECT project_image FROM projects WHERE id = $1", [id]);
        if (project.rowCount === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        const imageUrl = project.rows[0].project_image;
        // Delete from DB
        await client.query("DELETE FROM projects WHERE id = $1", [id]);
        // Delete image from Cloudinary
        const publicId = (0, cloudinary_url_1.getPublicIdFromUrl)(imageUrl);
        await cloudinary_1.v2.uploader.destroy(publicId);
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.deleteProject = deleteProject;
