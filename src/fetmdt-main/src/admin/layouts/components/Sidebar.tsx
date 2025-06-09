import { NavLink } from 'react-router-dom'
import routerList from '../../constants/routes'

export const Siderbar = () => {
    return (
        <nav className="sticky top-[74px] left-0 z-9 h-screen w-[284px]">
            {routerList.map((item) => {
                const Icon = item.icon
                return (
                    <NavLink
                        to={item.href}
                        key={item.title}
                        className="flex px-6 py-4 text-xl hover:bg-[#F8f9fb]"
                        end={true}
                        style={({ isActive, isPending }) => ({
                            borderRight: isActive ? '6px solid #44AEC3' : '',
                            fontWeight: isActive ? 'bold' : '',
                            color: isPending ? 'red' : 'black',
                        })}
                    >
                        <div className="flex items-center gap-4">
                            <Icon className="h-[27px] w-[27px]" />
                            <p>{item.title}</p>
                        </div>
                    </NavLink>
                )
            })}
        </nav>
    )
}
