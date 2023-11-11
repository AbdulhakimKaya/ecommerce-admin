import Link from "next/link";
import {useRouter} from "next/router";
import {TbCategory2} from "react-icons/tb";
import {HiOutlineArchiveBox, HiOutlineQueueList, HiOutlineWrenchScrewdriver} from "react-icons/hi2";
import {AiOutlineHome} from "react-icons/ai";
import {SiHomeassistantcommunitystore} from "react-icons/si";
import {MdLogout} from "react-icons/md";
import {signOut} from "next-auth/react";
import Logo from "@/components/Logo";



export default function Nav({show}) {
    const inactiveLink = 'flex gap-2 p-1'
    const activeLink = inactiveLink + ' bg-highlight text-black rounded-lg'

    const inactiveIcon = ''
    const activeIcon = '#5540F6'

    const router = useRouter()
    const {pathname} = router

    async function logOut() {
        await router.push('/')
        await signOut()
    }

    return (
        <aside
            className={
            (show ? 'left-0' : '-left-full') +
                " text-gray-500 p-6 fixed w-full h-full bg-bgGray transition-all md:static md:w-auto "
        }
        >

            <div className={"mb-4 mr-4"}>
                <Logo/>
            </div>
            <nav className={"flex flex-col gap-2"}>
                <Link href={"/"} className={pathname === '/' ? activeLink : inactiveLink}>
                    <AiOutlineHome size={24} color={pathname === '/' ? activeIcon : inactiveIcon}/>
                    Dashboard
                </Link>
                <Link href={"/products"} className={pathname.includes("/products") ? activeLink : inactiveLink}>
                    <HiOutlineArchiveBox size={24} color={pathname.includes("/products") ? activeIcon : inactiveIcon}/>
                    Products
                </Link>
                <Link href={"/categories"} className={pathname.includes("/categories") ? activeLink : inactiveLink}>
                    <TbCategory2 size={24} color={pathname.includes("/categories") ? activeIcon : inactiveIcon}/>
                    Categories
                </Link>
                <Link href={"/orders"} className={pathname.includes("/orders") ? activeLink : inactiveLink}>
                    <HiOutlineQueueList size={24} color={pathname.includes("/orders") ? activeIcon : inactiveIcon}/>
                    Orders
                </Link>
                <Link href={"/settings"} className={pathname.includes("/settings") ? activeLink : inactiveLink}>
                    <HiOutlineWrenchScrewdriver size={24} color={pathname.includes("/settings") ? activeIcon : inactiveIcon}/>
                    Settings
                </Link>
                <button onClick={logOut} className={inactiveLink}>
                    <MdLogout size={24}/>
                    Logout
                </button>
            </nav>
        </aside>
    )
}