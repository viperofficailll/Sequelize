import { Sequelize } from "sequelize";
export const dbconn = async () => {
  const sequelize = new Sequelize(
    `${process.env.DATABASE_NAME}`,
    `${process.env.DATABASE_USER}`,
    `${process.env.DATABASE_PASSWORD}`,
    {
      host: "localhost",
      dialect: "mysql",
    },
  );
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
