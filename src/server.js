import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import pageRoutes from './routes/pages.routes.js';
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
    
app.use(pageRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});