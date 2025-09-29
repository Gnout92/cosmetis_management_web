import mysql from "mysql2/promise";

export async function connect() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "DaiKa@0303!",
    database: "myphamshop",
  });
}
