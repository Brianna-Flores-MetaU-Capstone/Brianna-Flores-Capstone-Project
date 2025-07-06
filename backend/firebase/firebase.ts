import dotenv from  "dotenv"
dotenv.config()

// firebase admin for token verifiation
import admin from "firebase-admin";

const fromEnvFile = process.env.FIREBASE_ADMIN_KEY;
if (!fromEnvFile) {
  throw new Error("env variable not found");
}
const buffer = Buffer.from(fromEnvFile, "base64");
const jsonAsString = buffer.toString("utf-8");
const firebaseAdminKey = JSON.parse(jsonAsString)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminKey as admin.ServiceAccount),
  });
}

export default admin
