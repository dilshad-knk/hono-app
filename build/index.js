"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app_1 = require("@express-worker/app");
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// const app: Application = express();
const app = new app_1.ExpressWorker();
(0, db_1.default)();
const production = process.env.NODE_ENV == 'production';
app.use((0, cors_1.default)({
    credentials: true,
    origin: production ? "https://drag-n-plan.vercel.app" : "http://localhost:5173"
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v1', userRoutes_1.default);
app.use('/api/v1', taskRoutes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
