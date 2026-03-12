// Test setup file
import { config } from 'dotenv';

// Load environment variables for testing
config({ path: './config.env' });

console.log('Test environment loaded - using test database');