import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// put this inside config
const host = process.env.dbHost;
const port = process.env.dbPort;
const dbName = process.env.dbName;

async function main() {
  try {
    await mongoose.connect(`mongodb://${host}:${port}/${dbName}`, {
      useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on("error", (err) => {
      console.log({ err }, "unable to connect to user mongo database");
      process.exit(1);
    });
    db.once("open", () => {
      console.log(`connected to user mongo database ${host}:${port}/${dbName}`);
    });
  } catch (error) {
    console.log(error);
  }
}

export default main;
