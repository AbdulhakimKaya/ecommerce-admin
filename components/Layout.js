import {signIn, signOut, useSession} from "next-auth/react";
import Nav from "@/components/Nav";
import {FcGoogle} from "react-icons/fc";
import {FiMenu} from "react-icons/fi";
import {useState} from "react";
import Logo from "@/components/Logo";

export default function Layout({children}) {
    const [showNav, setShowNav] = useState(false)
    const { data: session } = useSession()

    if (!session) {
        return (
            <div className={"bg-bgGray w-screen h-screen flex items-center"}>
                <div className={"text-center w-full"}>
                    <button
                        className={"bg-white text-black text-xl font-bold p-2 px-4 rounded-lg"}
                        onClick={() => signIn('google')}
                    >
                        <FcGoogle size={32}/>
                        Login with Google
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={"bg-bgGray min-h-screen"}>
            <div className={"block md:hidden flex items-center p-4"}>
                <button onClick={() => setShowNav(!showNav)} className={"text-black"}>
                    <FiMenu size={24}/>
                </button>
                <div className={"flex grow justify-center mr-6"}>
                    <Logo/>
                </div>
            </div>
            <div className={"flex"}>
                <Nav show={showNav}/>
                <div className={"flex-grow p-6"}>
                    {children}
                </div>
            </div>
        </div>
    )
}
