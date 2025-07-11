// Signature generation code from Walmart API Documentation
// https://walmart.io/docs/walmart-identity/v1/supporting-information
import axios from "axios";
import * as crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const privateKey = `
-----BEGIN PRIVATE KEY-----
${process.env.WALMART_PRIVATE_KEY}
-----END PRIVATE KEY-----
`;
function getSign() {
  const consumerId = process.env.WALMART_CONSUMER_ID;
  const timestamp = new Date().getTime();
  const keyVersion = "1";
  const data = `${consumerId}\n${timestamp}\n${keyVersion}\n`;
  const rsaSigner = crypto.createSign("RSA-SHA256");
  rsaSigner.update(data);
  return {
    keyVersion,
    consumerId,
    timestamp: timestamp.toString(),
    signature: rsaSigner.sign(privateKey, "base64"),
  };
}
const authsign = getSign();

const searchWalmart = async (searchQuery: string) => {
  const { keyVersion, consumerId, timestamp, signature } = getSign();
  if (consumerId) {
    try {
      const response = await axios.get(`https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=${searchQuery}&numItems=3`, {
        headers: {
          "WM_SEC.KEY_VERSION": keyVersion,
          "WM_CONSUMER.ID": consumerId,
          "WM_CONSUMER.INTIMESTAMP": timestamp,
          "WM_SEC.AUTH_SIGNATURE": signature,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching data");
      return;
    }
  }
};

export { searchWalmart };
