import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";

export default function Home() {
    const {data: session} = useSession()

    return <Layout>
        <div className={"flex justify-between text-blue-900"}>
            <h2>
                Hello <b>{session?.user?.name}</b>
            </h2>
            <div className={"flex items-center gap-2 bg-gray-200 p-2 rounded-full"}>
                <img src={session?.user?.image} alt="user-image" className={"w-10 h-10 rounded-full"}/>
                <span>{session?.user?.name}</span>
            </div>
        </div>
    </Layout>
}
