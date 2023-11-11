import {SiHomeassistantcommunitystore} from "react-icons/si";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href={"/"} className={"flex gap-2"}>
            <SiHomeassistantcommunitystore size={28} color={'#5540F6'}/>
            <span>Ecommerce Admin</span>
        </Link>
    )
}