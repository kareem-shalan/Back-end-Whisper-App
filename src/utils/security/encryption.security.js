import CryptoJS from "crypto-js";
export const encrypt = async ({ plaintext = "", secretKey = process.env.ENCRYPTION_SECRET } = {}) => {
    return CryptoJS.AES.encrypt(plaintext, secretKey).toString()
}
export const decrypt = async ({ encryptedText = "", secretKey = process.env.ENCRYPTION_SECRET } = {}) => {
    return CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8)
}

// import crypto from "crypto"
// this using crypto node js instead of crypto js
// export const encryptWithCrypto = (text) => {
//     let iv = crypto.randomBytes(16)
//     const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv)
//     let encrypted = cipher.update(text, 'utf8', 'hex')
    
//     encrypted += cipher.final('hex')
//     return `${iv.toString('hex')}:${encrypted}`
// }

// export const decryptWithCrypto = (text) => {
//     const [iv, encrypted] = text.split(":")
//     const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'hex'))
//     let decrypted = decipher.update(encrypted, 'hex', 'utf8')
//     decrypted += decipher.final('utf8')
//     return decrypted
// }


