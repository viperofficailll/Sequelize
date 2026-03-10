import { App } from "./app.js";
import { dbconn } from "./config/dbconn.js";
import { Todos } from "./models/todo.model.js";
const PORT = process.env.PORT;

Todos.sync();
App.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
  dbconn();
});
