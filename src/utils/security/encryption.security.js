import CryptoJS from "crypto-js";
 
export const encrypt = async ({ plaintext = "", secretKey = process.env.ENCRYPTION_SECRET } = {}) => {
    return CryptoJS.AES.encrypt(plaintext, secretKey).toString()
}
export const decrypt = async ({ encryptedText = "", secretKey = process.env.ENCRYPTION_SECRET } = {}) => {
    return CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8)
}