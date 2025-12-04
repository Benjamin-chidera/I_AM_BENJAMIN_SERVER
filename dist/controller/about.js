"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAbout = exports.getAbout = exports.postAbout = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const postAbout = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { about_me } = req.body;
        const query = "INSERT INTO About(about_me) values ( $1 ) ";
        const values = [about_me];
        const result = await client.query(query, values);
        res
            .status(201)
            .json({ message: "About added successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.postAbout = postAbout;
const getAbout = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM about");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getAbout = getAbout;
const updateAbout = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { about_me } = req.body;
        const query = "UPDATE About SET about_me = $1 WHERE id = $2 RETURNING *";
        const values = [about_me, id];
        const result = await client.query(query, values);
        res
            .status(200)
            .json({ message: "Aboutupdated successfully", data: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.updateAbout = updateAbout;
