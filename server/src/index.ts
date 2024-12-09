import dotenv from 'dotenv';
import { App } from './app';

// Load environment variables
dotenv.config();

// Get port from environment variables or use default
const port = parseInt(process.env.PORT || '5000');

// Create and start application
const app = new App(port);
app.start();
