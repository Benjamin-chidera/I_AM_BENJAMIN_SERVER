"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCertification = exports.deleteCertification = exports.getCertification = exports.postCertification = void 0;
const connect_1 = __importDefault(require("../lib/connect"));
const postCertification = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { cert_name, issued_organization, year_issued, cert_url } = req.body;
        const query = "INSERT INTO certification (cert_name, issued_organization, year_issued, cert_url) values ( $1, $2, $3, $4 ) ";
        const values = [cert_name, issued_organization, year_issued, cert_url];
        const result = await client.query(query, values);
        res.status(201).json({
            message: "Certification added successfully",
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
exports.postCertification = postCertification;
const getCertification = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const result = await client.query("SELECT * FROM certification");
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.getCertification = getCertification;
const deleteCertification = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const query = "DELETE FROM certification WHERE id = $1";
        const values = [id];
        await client.query(query, values);
        res.status(200).json({ message: "Certification deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    finally {
        client.release();
    }
};
exports.deleteCertification = deleteCertification;
const updateCertification = async (req, res) => {
    const client = await connect_1.default.connect();
    try {
        const { id } = req.params;
        const { cert_name, issued_organization, year_issued, cert_url } = req.body;
        const query = "UPDATE certification SET cert_name = $1, issued_organization = $2, year_issued = $3, cert_url = $4 WHERE id = $5 RETURNING *";
        const values = [cert_name, issued_organization, year_issued, cert_url, id];
        const result = await client.query(query, values);
        res
            .status(200)
            .json({
            message: "Certification updated successfully",
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
exports.updateCertification = updateCertification;
