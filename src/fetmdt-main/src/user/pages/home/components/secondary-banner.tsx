import type React from 'react'
import { Link } from 'react-router-dom'
import { Banner } from '../../../../types/product'

interface SecondaryBannerProps {
    banner: Banner
}

const SecondaryBanner: React.FC<SecondaryBannerProps> = ({ banner }) => {
    return (
        <div className="relative h-[200px] overflow-hidden rounded-lg">
            <img
                src={banner.image || '/placeholder.svg'}
                alt={banner.title}
                className="object-cover"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/60 to-transparent">
                <div className="max-w-xs p-6 text-white">
                    <h3 className="mb-1 text-xl font-bold">{banner.title}</h3>
                    {banner.subtitle && (
                        <p className="mb-3 text-sm">{banner.subtitle}</p>
                    )}
                    <Link to={banner.link}>
                        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Xem thêm
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SecondaryBanner
