"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResume = exports.deleteResume = exports.getResume = exports.postResume = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const postResume = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { url } = req.body;
        const query = "INSERT INTO resume (url) values ( $1 ) ";
        const values = [url];
        const result = await client.query(query, values);
        res
            .status(201)
            .json({ message: "Resume added successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.postResume = postResume;
const getResume = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM resume");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getResume = getResume;
const deleteResume = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const query = "DELETE FROM resume WHERE id = $1";
        const values = [id];
        await client.query(query, values);
        res.status(200).json({ message: "Resume deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.deleteResume = deleteResume;
const updateResume = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { url } = req.body;
        const query = "UPDATE resume SET url = $1 WHERE id = $2 RETURNING *";
        const values = [url, id];
        const result = await client.query(query, values);
        res
            .status(200)
            .json({ message: "Resume updated successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.updateResume = updateResume;
