import { Category } from '../../types/product'

export const categories: Category[] = [
    {
        id: 'laptop',
        name: 'Laptop',
        slug: 'laptop',
        icon: 'laptop',
        subcategories: [
            {
                id: 'laptop-gaming',
                name: 'Laptop Gaming',
                slug: 'laptop-gaming',
            },
            {
                id: 'laptop-van-phong',
                name: 'Laptop Văn Phòng',
                slug: 'laptop-van-phong',
            },
            {
                id: 'laptop-do-hoa',
                name: 'Laptop Đồ Họa',
                slug: 'laptop-do-hoa',
            },
            {
                id: 'macbook',
                name: 'MacBook',
                slug: 'macbook',
            },
        ],
    },
    {
        id: 'dien-thoai',
        name: 'Điện thoại',
        slug: 'dien-thoai',
        icon: 'smartphone',
        subcategories: [
            {
                id: 'iphone',
                name: 'iPhone',
                slug: 'iphone',
            },
            {
                id: 'samsung',
                name: 'Samsung',
                slug: 'samsung',
            },
            {
                id: 'xiaomi',
                name: 'Xiaomi',
                slug: 'xiaomi',
            },
            {
                id: 'oppo',
                name: 'OPPO',
                slug: 'oppo',
            },
        ],
    },
    {
        id: 'may-tinh-bang',
        name: 'Máy tính bảng',
        slug: 'may-tinh-bang',
        icon: 'tablet',
        subcategories: [
            {
                id: 'ipad',
                name: 'iPad',
                slug: 'ipad',
            },
            {
                id: 'samsung-tab',
                name: 'Samsung Tab',
                slug: 'samsung-tab',
            },
            {
                id: 'xiaomi-pad',
                name: 'Xiaomi Pad',
                slug: 'xiaomi-pad',
            },
        ],
    },
    {
        id: 'man-hinh',
        name: 'Màn hình',
        slug: 'man-hinh',
        icon: 'monitor',
        subcategories: [
            {
                id: 'man-hinh-gaming',
                name: 'Màn hình Gaming',
                slug: 'man-hinh-gaming',
            },
            {
                id: 'man-hinh-do-hoa',
                name: 'Màn hình Đồ họa',
                slug: 'man-hinh-do-hoa',
            },
            {
                id: 'man-hinh-van-phong',
                name: 'Màn hình Văn phòng',
                slug: 'man-hinh-van-phong',
            },
        ],
    },
    {
        id: 'tai-nghe',
        name: 'Tai nghe',
        slug: 'tai-nghe',
        icon: 'headphones',
        subcategories: [
            {
                id: 'tai-nghe-khong-day',
                name: 'Tai nghe không dây',
                slug: 'tai-nghe-khong-day',
            },
            {
                id: 'tai-nghe-co-day',
                name: 'Tai nghe có dây',
                slug: 'tai-nghe-co-day',
            },
            {
                id: 'tai-nghe-gaming',
                name: 'Tai nghe Gaming',
                slug: 'tai-nghe-gaming',
            },
        ],
    },
    {
        id: 'chuot',
        name: 'Chuột',
        slug: 'chuot',
        icon: 'mouse',
        subcategories: [
            {
                id: 'chuot-gaming',
                name: 'Chuột Gaming',
                slug: 'chuot-gaming',
            },
            {
                id: 'chuot-van-phong',
                name: 'Chuột Văn phòng',
                slug: 'chuot-van-phong',
            },
            {
                id: 'chuot-khong-day',
                name: 'Chuột không dây',
                slug: 'chuot-khong-day',
            },
        ],
    },
    {
        id: 'ban-phim',
        name: 'Bàn phím',
        slug: 'ban-phim',
        icon: 'keyboard',
        subcategories: [
            {
                id: 'ban-phim-co',
                name: 'Bàn phím cơ',
                slug: 'ban-phim-co',
            },
            {
                id: 'ban-phim-gaming',
                name: 'Bàn phím Gaming',
                slug: 'ban-phim-gaming',
            },
            {
                id: 'ban-phim-khong-day',
                name: 'Bàn phím không dây',
                slug: 'ban-phim-khong-day',
            },
        ],
    },
    {
        id: 'loa',
        name: 'Loa',
        slug: 'loa',
        icon: 'speaker',
        subcategories: [
            {
                id: 'loa-bluetooth',
                name: 'Loa Bluetooth',
                slug: 'loa-bluetooth',
            },
            {
                id: 'loa-may-tinh',
                name: 'Loa máy tính',
                slug: 'loa-may-tinh',
            },
            {
                id: 'loa-soundbar',
                name: 'Loa Soundbar',
                slug: 'loa-soundbar',
            },
        ],
    },
    {
        id: 'may-anh',
        name: 'Máy ảnh',
        slug: 'may-anh',
        icon: 'camera',
        subcategories: [
            {
                id: 'may-anh-mirrorless',
                name: 'Máy ảnh Mirrorless',
                slug: 'may-anh-mirrorless',
            },
            {
                id: 'may-anh-dslr',
                name: 'Máy ảnh DSLR',
                slug: 'may-anh-dslr',
            },
            {
                id: 'may-anh-compact',
                name: 'Máy ảnh Compact',
                slug: 'may-anh-compact',
            },
        ],
    },
    {
        id: 'dong-ho-thong-minh',
        name: 'Đồng hồ thông minh',
        slug: 'dong-ho-thong-minh',
        icon: 'watch',
        subcategories: [
            {
                id: 'apple-watch',
                name: 'Apple Watch',
                slug: 'apple-watch',
            },
            {
                id: 'samsung-galaxy-watch',
                name: 'Samsung Galaxy Watch',
                slug: 'samsung-galaxy-watch',
            },
            {
                id: 'garmin',
                name: 'Garmin',
                slug: 'garmin',
            },
        ],
    },
]
