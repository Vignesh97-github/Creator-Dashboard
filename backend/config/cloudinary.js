import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()

//configration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const uploadOnCloudinary = async (localImagePath) => {   
    try {
        const response = await cloudinary.uploader.upload(localImagePath, { type: 'upload' })
        //console.log('response -->', response)
        return response.url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return null; // or undefined
    }
}

export default uploadOnCloudinary;