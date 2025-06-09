import { Link } from 'react-router-dom'
import type { Category } from '../../../../types/category'
import {
    LaptopIcon,
    SmartphoneIcon,
    TabletIcon,
    MonitorIcon,
    HeadphonesIcon,
    MouseIcon,
    KeyboardIcon,
    SpeakerIcon,
    CameraIcon,
    WatchIcon,
} from 'lucide-react'

// Map các icon cho từng loại danh mục
const categoryIcons = {
    laptop: LaptopIcon,
    smartphone: SmartphoneIcon,
    tablet: TabletIcon,
    monitor: MonitorIcon,
    headphones: HeadphonesIcon,
    mouse: MouseIcon,
    keyboard: KeyboardIcon,
    speaker: SpeakerIcon,
    camera: CameraIcon,
    watch: WatchIcon,
}

interface CategoryGridProps {
    categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    // Hàm lấy icon dựa trên slug của danh mục
    const getIconComponent = (iconName: string) => {
        const IconComponent =
            categoryIcons[iconName as keyof typeof categoryIcons] || LaptopIcon
        return <IconComponent className="h-8 w-8 text-blue-600" />
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/shop?category=${category.slug}`}
                    className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                        {getIconComponent(category.icon || category.slug)}
                    </div>
                    <h3 className="text-center text-sm font-medium text-gray-800">
                        {category.name}
                    </h3>
                    {category.subcategories &&
                        category.subcategories.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                                {category.subcategories.length} danh mục con
                            </p>
                        )}
                </Link>
            ))}

            {/* Hiển thị skeleton nếu không có danh mục */}
            {categories.length === 0 &&
                Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm"
                    >
                        <div className="mb-3 h-16 w-16 animate-pulse rounded-full bg-gray-200"></div>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                    </div>
                ))}
        </div>
    )
}
