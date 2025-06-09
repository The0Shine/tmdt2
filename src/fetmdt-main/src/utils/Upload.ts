// Khởi tạo repository với base URL từ biến môi trường

// Hàm tải lên hình ảnh
export const uploadImage = async (file: File): Promise<string> => {
    try {
        console.log('Bắt đầu tải lên file:', file.name)

        // Tạo FormData để gửi file
        const formData = new FormData()
        formData.append('file', file)

        // Sử dụng fetch API để có thêm thông tin debug
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    // Không cần set Content-Type, fetch sẽ tự động set khi dùng FormData
                    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                },
            },
        )

        console.log('Status code:', response.status)

        // Kiểm tra response status
        if (!response.ok) {
            const errorText = await response.text()
            console.error('Server error:', errorText)
            throw new Error(`Lỗi server: ${response.status}`)
        }

        // Parse JSON response
        const responseData = await response.json()
        console.log('Response data:', responseData)

        // Kiểm tra cấu trúc response từ server
        // Dựa vào hàm jsonOne, response có dạng { data: { ... } }
        if (responseData && responseData.data) {
            const imageData = responseData.data
            // Ưu tiên secure_url, nếu không có thì dùng url
            const imageUrl = imageData.secure_url || imageData.url

            if (imageUrl) {
                console.log('URL hình ảnh đã upload:', imageUrl)
                return imageUrl
            }
        }

        console.error(
            'Không tìm thấy URL hình ảnh trong response:',
            responseData,
        )
        throw new Error('Không tìm thấy URL hình ảnh trong response')
    } catch (error: any) {
        console.error('Chi tiết lỗi khi tải lên hình ảnh:', error)
        throw error
    }
}

// Hàm tải lên nhiều hình ảnh
export const uploadMultipleImages = async (
    files: File[],
): Promise<string[]> => {
    try {
        console.log('Bắt đầu tải lên nhiều file:', files.length)

        // Tạo FormData để gửi nhiều file
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file)
        })

        // Sử dụng fetch API
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/upload/multiple`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                },
            },
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Server error:', errorText)
            throw new Error(`Lỗi server: ${response.status}`)
        }

        const responseData = await response.json()
        console.log('Response data:', responseData)

        // Kiểm tra cấu trúc response từ server
        // Dựa vào hàm jsonAll, response có dạng { data: [...], meta: {...} }
        if (
            responseData &&
            responseData.data &&
            Array.isArray(responseData.data)
        ) {
            const imageUrls = responseData.data.map(
                (item: { secure_url: any; url: any }) =>
                    item.secure_url || item.url,
            )
            console.log('URLs hình ảnh đã upload:', imageUrls)
            return imageUrls
        }

        console.error(
            'Không tìm thấy URLs hình ảnh trong response:',
            responseData,
        )
        throw new Error('Không tìm thấy URLs hình ảnh trong response')
    } catch (error: any) {
        console.error('Chi tiết lỗi khi tải lên nhiều hình ảnh:', error)
        throw error
    }
}

// Hàm tải lên hình ảnh từ base64
export const uploadBase64Image = async (
    base64Image: string,
): Promise<string> => {
    try {
        console.log('Bắt đầu tải lên hình ảnh base64')

        // Sử dụng fetch API
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/upload/base64`,
            {
                method: 'POST',
                body: JSON.stringify({ image: base64Image }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                },
            },
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Server error:', errorText)
            throw new Error(`Lỗi server: ${response.status}`)
        }

        const responseData = await response.json()
        console.log('Response data:', responseData)

        // Kiểm tra cấu trúc response từ server
        if (responseData && responseData.data) {
            const imageUrl =
                responseData.data.secure_url || responseData.data.url

            if (imageUrl) {
                console.log('URL hình ảnh đã upload:', imageUrl)
                return imageUrl
            }
        }

        console.error(
            'Không tìm thấy URL hình ảnh trong response:',
            responseData,
        )
        throw new Error('Không tìm thấy URL hình ảnh trong response')
    } catch (error: any) {
        console.error('Chi tiết lỗi khi tải lên hình ảnh base64:', error)
        throw error
    }
}

// Hàm xóa hình ảnh
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
        // Trích xuất public_id từ URL
        const urlParts = imageUrl.split('/')
        const folderAndFilename = urlParts
            .slice(urlParts.indexOf('products'))
            .join('/')
        const publicId = folderAndFilename.split('.')[0]

        console.log('Xóa hình ảnh với public_id:', publicId)

        // Sử dụng fetch API
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/upload`,
            {
                method: 'DELETE',
                body: JSON.stringify({ public_id: publicId }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                },
            },
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Server error:', errorText)
            throw new Error(`Lỗi server: ${response.status}`)
        }

        const responseData = await response.json()
        console.log('Response data:', responseData)

        // Kiểm tra kết quả xóa
        if (responseData && responseData.data && responseData.data.success) {
            return true
        }

        return false
    } catch (error: any) {
        console.error('Chi tiết lỗi khi xóa hình ảnh:', error)
        return false
    }
}

// Chuyển đổi base64 thành File
export const base64ToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}
