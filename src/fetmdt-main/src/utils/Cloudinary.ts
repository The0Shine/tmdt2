// Servicio para interactuar con Cloudinary
import axios from 'axios'

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dnehzymia'
const CLOUDINARY_API_KEY = '188382119114921'
const CLOUDINARY_UPLOAD_PRESET = 'ml_default' // Puedes crear un preset personalizado en Cloudinary

// Función para subir una imagen a Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
        // Crear un FormData para enviar el archivo
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)
        formData.append('api_key', CLOUDINARY_API_KEY)

        // Realizar la solicitud a la API de Cloudinary
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
        )

        // Devolver la URL de la imagen subida
        return response.data.secure_url
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error)
        throw new Error(
            'No se pudo subir la imagen. Por favor, inténtelo de nuevo.',
        )
    }
}

// Función para eliminar una imagen de Cloudinary
export const deleteImageFromCloudinary = async (
    imageUrl: string,
): Promise<boolean> => {
    try {
        // Extraer el public_id de la URL
        const urlParts = imageUrl.split('/')
        const filenameWithExtension = urlParts[urlParts.length - 1]
        const publicId = filenameWithExtension.split('.')[0]

        // Esta parte normalmente requeriría una llamada a un backend que maneje la autenticación segura
        // Ya que las credenciales de API no deben exponerse en el frontend
        // Aquí solo simulamos el éxito de la operación
        console.log(
            `Simulando eliminación de imagen con public_id: ${publicId}`,
        )

        return true
    } catch (error) {
        console.error('Error al eliminar imagen de Cloudinary:', error)
        return false
    }
}
