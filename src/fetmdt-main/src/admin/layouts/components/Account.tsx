import { IconBell, IconDrop } from '../../components/icons'

export const Account = () => {
    return (
        <div className="relative flex items-center">
            <div className="cursor-pointer text-3xl">
                <IconBell />
            </div>
            <div className="mx-4">
                <h2 className="cursor-pointer font-medium">Name </h2>
                <p className="cursor-pointer">email</p>
            </div>
            <div className="mr-4 h-12 w-12 cursor-pointer overflow-hidden rounded-full object-cover"></div>
            <div className="cursor-pointer text-xl">
                <IconDrop />
            </div>

            <div
                className={`absolute top-16 right-0 ${'invisible opacity-0'} rounded-sm bg-white shadow-lg transition-all duration-300 ease-in-out`}
            >
                <button className="flex items-center justify-center gap-2 p-2 text-[14px] font-bold text-neutral-500 hover:text-black hover:underline">
                    {' '}
                    <div></div> <div> Thông tin đăng nhập </div>
                </button>
                <button className="flex items-center justify-center gap-2 p-2 text-[14px] font-bold text-neutral-500 hover:text-black hover:underline">
                    {' '}
                    <div></div> <div className="shrink-0"> Đăng xuất </div>
                </button>
            </div>
        </div>
    )
}
