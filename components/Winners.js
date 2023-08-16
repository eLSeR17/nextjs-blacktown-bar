import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css";


export default function Winners() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const barAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables

    const [poolWinners, setPoolWinners] = useState("0")
    const [footballWinners, setFootballWinners] = useState("0")
    const [dartsWinners, setDartsWinners] = useState("0")
    const [chessWinners, setChessWinners] = useState("0")

    
    const dispatch = useNotification()

    /* View Functions */

    const { runContractFunction: getPoolWinners } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getPoolWinners",
        params: {},
    })

    const { runContractFunction: getFootballWinners } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getFootballWinners",
        params: {},
    })

    const { runContractFunction: getDartsWinners } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getDartsWinners",
        params: {},
    })

    const { runContractFunction: getChessWinners } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getChessWinners",
        params: {},
    })

    async function updateUIValues() {
        var poolWinnersFromCall = (await getPoolWinners())
        var footballWinnersFromCall = (await getFootballWinners()).toString()
        var dartsWinnersFromCall = (await getDartsWinners()).toString()
        var chessWinnersFromCall = (await getChessWinners()).toString()

        var poolWinnersOrdered;

        for(var i=0; i<5; i++){
            poolWinnersOrdered.appendChild(document.createTextNode(poolWinnersFromCall[i] + "\n"))
        }
        
        
        setPoolWinners(poolWinnersOrdered)
        setFootballWinners(footballWinnersFromCall)
        setDartsWinners(dartsWinnersFromCall)
        setChessWinners(chessWinnersFromCall)
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
            <h1 className="py-4 px-4 font-bold text-2xl">Come see the most recent winners</h1>

            {barAddress ? (
                <>
                    <div className="py-2 flex-row">
                    <div>Pool winners: {poolWinners}</div>
                    <div>Football winners: {footballWinners}</div>
                    <div>Darts winners: {dartsWinners}</div>
                    <div>Chess winners: {chessWinners}</div>
                    </div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
