import { App } from "./app.js";
const PORT = process.env.PORT;

App.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
