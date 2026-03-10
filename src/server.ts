import { App } from "./app.js";
import { dbconn } from "./config/dbconn.js";
const PORT = process.env.PORT;

App.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
  dbconn();
});
