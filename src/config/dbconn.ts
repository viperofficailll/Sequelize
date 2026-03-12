import { Sequelize } from "sequelize";

// Function to get current config (evaluated at runtime)
const getConfig = () => {
  const isTest = process.env.NODE_ENV === 'test';
  
  // Dev config
  const devConfig = {
    database: process.env.DATABASE_NAME || 'todos',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    host: 'localhost',
    dialect: 'mysql' as const,
  };

  // Test config (separate test database)
  const testConfig = {
    database: process.env.TEST_DATABASE_NAME || 'todos_test',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    host: 'localhost',
    dialect: 'mysql' as const,
  };

  return isTest ? testConfig : devConfig;
};

// Lazy Sequelize instance
let sequelizeInstance: Sequelize | null = null;

// Function to get Sequelize instance (lazy initialization)
const getSequelize = () => {
  if (!sequelizeInstance) {
    const config = getConfig();
    sequelizeInstance = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        dialect: config.dialect,
        logging: process.env.NODE_ENV === 'test' ? false : console.log,
      }
    );
  }
  return sequelizeInstance;
};

// Export a getter for sequelize
export const sequelize = new Proxy({} as Sequelize, {
  get(target, prop) {
    const instance = getSequelize();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

export const dbconn = async () => {
  try {
    const config = getConfig();
    await sequelize.authenticate();
    console.log(`Connection established successfully to ${config.database} (${process.env.NODE_ENV === 'test' ? 'test' : 'dev'} mode)`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
