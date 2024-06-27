import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";
import { config } from "dotenv";
config();

/* The `cloudinary.config()` function call is configuring the Cloudinary SDK with the necessary
credentials to authenticate and interact with the Cloudinary API. It sets the `cloud_name`,
`api_key`, and `api_secret` values required for authentication. These values are retrieved from
environment variables using `process.env` to keep sensitive information secure and separate from the
codebase. This configuration allows the application to upload and manage files on Cloudinary using
the provided credentials. */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * The function `uploadOnCloudinary` uploads a file from a local path to Cloudinary and returns the
 * response URL, handling errors by deleting the local file if the upload fails.
 * The `localFilePath` parameter in the `uploadOnCloudinary` function is the
 * file path of the file that you want to upload to Cloudinary. It should be a string representing the
 * local file path on your server or computer.
 * The `uploadOnCloudinary` function returns the response object from Cloudinary after
 * successfully uploading a file. If the upload fails, it throws an `ApiError` with a status code of
 * 410 and an error message.
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("FILE UPLOADED SUCCESSFULLY: ",response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temp file as upload got failed
        throw new ApiError(410,"File Not uploaded to cloudinary",error)
    }
}

/**
 * The function `deleteFromCloudinary` deletes an image file from Cloudinary based on the provided file
 * URL.
 * `fileUrl` is the URL of the file stored in Cloudinary that you want to delete.
 * The function `deleteFromCloudinary` returns the response from the Cloudinary API after
 * attempting to delete the file specified by the `fileUrl`. If the fileUrl is not provided or is
 * invalid, the function returns `null`. If the deletion is successful, it returns the response object
 * from Cloudinary. If an error occurs during the deletion process, it throws an `ApiError` with status
 * code
 */
const deleteFromCloudinary = async (fileUrl) => {
    try {
        if(!fileUrl) return null;
        const publicId = await fileUrl.split('/').pop().split('.')[0];
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });
        console.log("FILE DELETED SUCCESSFULLY:", response);
        return response;
    } catch (error) {
        throw new ApiError(410, "File not deleted from cloudinary", error);
    }
}


export {uploadOnCloudinary,deleteFromCloudinary}
