import { exec } from "child_process";
import "dotenv/config";

if (!process.env.DB_URI) {
  console.error("Error: DB_URI is not defined in backend/.env");
  process.exit(1);
}

// Mask password in logs to protect connection strings
const maskedUri = process.env.DB_URI.replace(/:([^:@]+)@/, ":******@");
console.log(`Initializing manual database dump for: ${maskedUri}`);

// Dump the database to a git-ignored production-backups folder
const command = `mongodump --uri="${process.env.DB_URI}" --out="./production-backups/"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup execution failed: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.log(stderr); // Logs progress lines from mongodump
  }
  console.log(
    "SUCCESS: Backup successfully saved to backend/production-backups/",
  );
  process.exit(0);
});
