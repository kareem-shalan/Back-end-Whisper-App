import { v2 as cloudinary } from 'cloudinary';


export const cloud = () => {


    cloudinary.config(

        {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        }
    )
    return cloudinary

}


export const uploadToCloudinary = async ({ path, folder } = {}) => {

    return await cloud().uploader.upload(path, { folder });
}


export const uploadMultipleToCloudinary = async ({ files = [], path = "general" } = {}) => {
    try {
        let attachments = []
        for (const file of files) {
            const { public_id, secure_url } = await uploadToCloudinary({ path: file.path, folder: path })
            attachments.push({ public_id, secure_url })
        }
        return attachments
    } catch (error) {
        throw error
    }
}

export const destroyFromCloudinary = async ({ public_id = "" } = {}) => {
    return await cloud().uploader.destroy(public_id)
}

export const deleteResourcesFromCloudinary = async ({
    public_ids = [],
    options = { type: "upload", resource_type: "image" }
} = {}) => {
    return await cloud().api.delete_resources(public_ids, options)
}

export const deleteResourcesFromCloudinaryByPrefix = async (
    { prefix = "" } = {}) => {
        return await cloud().api.delete_resources_by_prefix(prefix)



}

