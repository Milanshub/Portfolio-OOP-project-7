import dotenv from 'dotenv';
import app from './app';
import { Logger } from './utils/logger';

// Load environment variables
dotenv.config({ path: '.env.local' });

const logger = Logger.getInstance();
const port = process.env.PORT || 5000;

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});