import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css";


export default function Drinks() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const barAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables

    const [orderedDrink, setOrderedDrink] = useState("0")
    const [orderedDrinkPrice, setOrderedDrinkPrice] = useState("0")

    const dispatch = useNotification()

    const {
    runContractFunction: orderDrinks,
    data: enterTxResponse,
    isLoading,
    isFetching,
    } = useWeb3Contract({
    abi: abi,
    contractAddress: barAddress,
    functionName: "orderDrinks",
    msgValue: orderedDrinkPrice,
    params: {drink: orderedDrink},
    })

    /* View Functions */


    const { runContractFunction: getDrinksPrice } = useWeb3Contract({
        abi: abi,
        contractAddress: barAddress, // specify the networkId
        functionName: "getDrinksPrice",
        params: {drink: orderedDrink},
    })

    async function updateUIValues() {
        const orderedDrinkPriceFromCall = (await getDrinksPrice()).toString()
        
        setOrderedDrinkPrice(ethers.utils.formatEther(orderedDrinkPriceFromCall))
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [])

    useEffect(() => {
        if (isWeb3Enabled) {
            orderDrinks()
        }
    }, [orderedDrink])

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

            {barAddress ? (
                <>
                <div className="py-2">
                    <div className="py-8">Wanna have some drinks?</div>
                    <input class="input-border" type="text" id="drink"/>
                    <div className={styles.botones}>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>{
                            const myDrink = await document.getElementById("drink").value
                            setOrderedDrinkPrice(myDrink)
                            setOrderedDrink(myDrink)
                        }
                        }
                        disabled={isLoading || isFetching}
                    >                      
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Order my drink!"
                        )}
                    </button>

                    </div>
                    <div>Your drink is {orderedDrink}</div>
                    <div>The price of our drink is {orderedDrinkPrice} ether</div>
                    </div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
