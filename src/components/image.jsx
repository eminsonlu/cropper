import { usePosition } from "../store/position-store";

export default function Image() {
    const { state } = usePosition();

    return (
        <div className="w-[700px] h-[700px] bg-orange-400"></div>
    );
}