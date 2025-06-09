import { IconPinned, IconSub } from '../../../components/icons'
import { Client, Calendar } from './index'

export const Note = () => (
    <div className="rounded-3xl bg-[#F8F9FB]">
        <div className="mx-2 flex justify-between rounded-xl px-4 py-4 shadow-xl">
            <div className="flex flex-auto flex-col items-center">
                <h2>Số mặt hàng</h2>
                <img src="./public/image/folder.svg" alt="" />
                <p className="text-2xl font-semibold">1000</p>
            </div>
            <div className="flex flex-auto flex-col items-center border-x-2 border-dashed border-[#858D92]">
                <h2>Lượt mua</h2>
                <img src="./public/image/circle.svg" alt="" />
                <p className="text-2xl font-semibold">1000</p>
            </div>
            <div className="flex flex-auto flex-col items-center">
                <h2>Trả hàng</h2>
                <img src="./public/image/bag.svg" alt="" />
                <p className="text-2xl font-semibold">1000</p>
            </div>
        </div>

        <Calendar />
    </div>
)
