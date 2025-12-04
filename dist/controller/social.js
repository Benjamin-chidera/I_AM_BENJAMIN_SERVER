"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSocial = exports.deleteSocial = exports.getSocial = exports.postSocial = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const postSocial = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { platform_name, handle, url } = req.body;
        const query = "INSERT INTO social (platform_name, handle, url) values ( $1, $2, $3 ) ";
        const values = [platform_name, handle, url];
        const result = await client.query(query, values);
        res
            .status(201)
            .json({ message: "Social added successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.postSocial = postSocial;
const getSocial = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM social");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getSocial = getSocial;
const deleteSocial = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const query = "DELETE FROM social WHERE id = $1";
        const values = [id];
        await client.query(query, values);
        res.status(200).json({ message: "social deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.deleteSocial = deleteSocial;
const updateSocial = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { platform_name, handle, url } = req.body;
        const query = "UPDATE social SET platform_name = $1, handle = $2, url = $3 WHERE id = $4 RETURNING *";
        const values = [platform_name, handle, url, id];
        const result = await client.query(query, values);
        res
            .status(200)
            .json({ message: "Social updated successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.updateSocial = updateSocial;
