"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExperience = exports.deleteExperience = exports.getExperience = exports.postExperience = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const postExperience = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { role, company_name, years, description, projects_done } = req.body;
        if (!role || !company_name || !years || !description || !projects_done) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const query = "INSERT INTO experience (role, company_name, years, description, projects_done) values ( $1, $2, $3, $4, $5 ) RETURNING *";
        const values = [role, company_name, years, description, projects_done];
        const result = await client.query(query, values);
        res
            .status(201)
            .json({ message: "Experience added successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.postExperience = postExperience;
const getExperience = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM experience");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getExperience = getExperience;
const deleteExperience = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const query = "DELETE FROM experience WHERE id = $1";
        const values = [id];
        await client.query(query, values);
        res.status(200).json({ message: "Experience deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.deleteExperience = deleteExperience;
const updateExperience = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { role, company_name, years, description, projects_done } = req.body;
        // 
        const query = "UPDATE experience SET role = $1, company_name = $2, years = $3, description = $4, projects_done = $5 WHERE id = $6 RETURNING *";
        const values = [role, company_name, years, description, projects_done, id];
        const result = await client.query(query, values);
        res.status(200).json({
            message: "Experience updated successfully",
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
exports.updateExperience = updateExperience;
