import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl"> Blacktown Bar</h1>
            <Link href="/">
                <a className="mr-4 p-6">Go to the bar!</a>
            </Link>
            <Link href="/winners">
                <a className="mr-4 p-6">See the winners</a>
            </Link>
            <Link href="/drinks">
                <a className="mr-4 p-6">Order some drinks</a>
            </Link>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false}/>
            </div>
        </nav>
    )
}