import type React from 'react'
import { ChevronRight } from 'lucide-react'
import { Banner } from '../../../../types/product'
import { Link } from 'react-router-dom'

interface HeroBannerProps {
    banner: Banner
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banner }) => {
    return (
        <div className="relative h-[400px] overflow-hidden rounded-lg md:h-[500px]">
            <img
                src={banner.image || '/placeholder.svg'}
                alt={banner.title}
                className="object-cover"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/70 to-transparent">
                <div className="max-w-xl p-8 text-white md:p-12">
                    <h2 className="mb-3 text-3xl font-bold md:text-4xl">
                        {banner.title}
                    </h2>
                    {banner.subtitle && (
                        <p className="mb-6 text-lg md:text-xl">
                            {banner.subtitle}
                        </p>
                    )}
                    <Link to={banner.link}>
                        <button className="flex items-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
                            Xem ngay
                            <ChevronRight size={18} className="ml-1" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HeroBanner
