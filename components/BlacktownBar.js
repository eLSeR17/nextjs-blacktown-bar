import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css";


export default function BlacktownBar() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const barAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables

    const [poolFee, setPoolFee] = useState("0")
    const [footballFee, setFootballFee] = useState("0")
    const [dartsFee, setDartsFee] = useState("0")
    const [prize, setPrize] = useState("0")
    const [gameNumber, setGameNumber] = useState("0")
    const [winner, setWinner] = useState("0")

    const dispatch = useNotification()

    const {
    runContractFunction: playPool,
    data: enterTxResponse,
    isLoading,
    isFetching,
    } = useWeb3Contract({
    abi: abi,
    contractAddress: barAddress,
    functionName: "playPool",
    msgValue: poolFee,
    params: {},
    })

    const {
    runContractFunction: playFootball,
    } = useWeb3Contract({
    abi: abi,
    contractAddress: barAddress,
    functionName: "playFootball",
    msgValue: footballFee,
    params: {},
    })

    const {
    runContractFunction: playDarts,
    } = useWeb3Contract({
    abi: abi,
    contractAddress: barAddress,
    functionName: "playDarts",
    msgValue: dartsFee,
    params: {},
    })

    /* View Functions */

    const { runContractFunction: getPoolFee } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getPoolFee",
        params: {},
    })

    const { runContractFunction: getFootballFee } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getFootballFee",
        params: {},
    })

    const { runContractFunction: getDartsFee } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getDartsFee",
        params: {},
    })

    async function updateUIValues() {
        const poolFeeFromCall = (await getPoolFee()).toString()
        const footballFeeFromCall = (await getFootballFee()).toString()
        const dartsFeeFromCall = (await getDartsFee()).toString()

        setPoolFee(ethers.utils.formatEther(poolFeeFromCall))
        setFootballFee(ethers.utils.formatEther(footballFeeFromCall))
        setDartsFee(ethers.utils.formatEther(dartsFeeFromCall))
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Blacktown Bar</h1>
            <div className="py-2 px-4 text-2xl">Open 24 hours a day, 365 days a year</div>
            <div className="py-2 px-4 text-2xl">Powered by Ethereum</div>


            {barAddress ? (
                <>
                <div className="py-2">
                    <div className="py-8">Wanna play some games?</div>

                    <div className={styles.botones}>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>{
                            await playPool()
                        }
                        }
                        disabled={isLoading || isFetching}
                    >                      
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Play Pool"
                        )}
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>{
                            await playFootball()
                        }
                        }
                        disabled={isLoading || isFetching}
                    >                     
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Play football"
                        )}
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>{
                            await playDarts()
                        }
                        }
                        disabled={isLoading || isFetching}
                    >                      
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Play darts"
                        )}
                    </button>
                    </div>
                    <div>Your pool fee is {poolFee} ether</div>
                    <div>Your football fee is {footballFee} ether</div>
                    <div>Your darts fee is {dartsFee} ether</div>
                    </div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
