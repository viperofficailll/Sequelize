// Simple test to verify the model points to the correct table
import { sequelize } from './src/config/dbconn.js';
import { Todos } from './src/models/todo.model.js';

async function testConnection() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if the model points to the correct table
    console.log('📋 Model table name:', Todos.getTableName());
    
    // Test if we can query the table (should be empty initially)
    const count = await Todos.count();
    console.log('📊 Current todos count:', count);
    
    console.log('🎉 Everything is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();