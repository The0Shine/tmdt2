import { ImgNumber } from '../../components/icons'
import { Account } from './Account'
import { Search } from './Search'

export const Header = () => {
    return (
        <header className="fixed z-10 flex w-full items-center justify-between bg-white px-6 py-2">
            <div className="h-[56px] w-[214px]">
                <ImgNumber />
            </div>
            <Search />
            <Account />
        </header>
    )
}
