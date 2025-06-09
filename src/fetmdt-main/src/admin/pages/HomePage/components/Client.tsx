interface ClientProps {
    properties: string
    name: string
    des: string
}
export const Client = ({ properties, name, des }: ClientProps) => (
    <div className="mb-4 rounded-md bg-[#FFFFFF] p-4">
        <h3>{properties}</h3>
        <p className="font-semibold text-[#44AEC3]">{name}</p>
        <p>{des}</p>
    </div>
)
