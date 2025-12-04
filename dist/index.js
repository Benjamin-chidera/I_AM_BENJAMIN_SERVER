"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cloudinary_1 = require("cloudinary");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const route_1 = __importDefault(require("./router/route"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", route_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
