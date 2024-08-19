/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { connect, connection, disconnect } from "mongoose";
import Environment from "./env";

const { DB_URI } = Environment;

const connectDatabase = () => {
  const db = connect(DB_URI);

  db.then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

  connection.on("connected", () => {
    console.info("Connected to MongoDB!");
  });

  connection.on("reconnected", () => {
    console.info("MongoDB reconnected!");
  });

  connection.on("error", (error) => {
    console.error(`Error in MongoDB connection: ${error}`);
    disconnect();
  });

  connection.on("disconnected", () => {
    console.error(`MongoDB disconnected! Reconnecting in ${5}s...`);
    setTimeout(() => this, 5000);
  });
};

export default connectDatabase;
