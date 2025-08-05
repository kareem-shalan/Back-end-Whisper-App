import bcrypt from "bcryptjs";

export const generateHash = async ({ plaintext = "", saltRound = process.env.SALT_ROUND || 12 } = {}) => {
    return bcrypt.hashSync(plaintext, parseInt(saltRound))
}
export const compareHash = async ({ plaintext = "", hashedText = "" } = {}) => {
    return bcrypt.compare(plaintext, hashedText)
}