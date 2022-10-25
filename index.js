//Raw js (frontend js) --> import
// Node js --> require

import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const ethereum = window.ethereum;
const metamaskExists = typeof window.ethereum !== "undefined";

const connectButton = document.getElementById("connectButton")
const fundBtn = document.getElementById("fundButton")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withdrawBtn")


connectButton.onclick = connectToMetamask  //passing pointers to the function
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

console.log(ethers)
async function connectToMetamask() {
    //made it async in order to call it asynchronously
    //when button is pressed.
    document.getElementById("connectButton").innerHTML = "Connect";
    if (metamaskExists) {
        console.log("Let's goo MetaMask!!");
        await ethereum.request({ method: "eth_requestAccounts" });
        document.getElementById("connectButton").innerHTML = "Connected!";
    } else {
        console.log("No MetaMask :(");
        document.getElementById("connectButton").innerHTML =
            "Install Metamask";
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    // console.log(`Funding with ${ethAmount}....`)
    //Provider --> Connection to the blockchain
    // Signer --> Current account connected with metamask
    if (metamaskExists) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(contractAddress)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })

            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!!")
        } catch (error) {
            console.log(error)
        }

    }

}

async function withdraw() {
    if (metamaskExists) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()

            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {

    console.log(`Mining ${transactionResponse.hash}...`)

    return new Promise((resolve, reject) => { //resolve and reject is the syntax of Promise()
        provider.once(transactionResponse.hash, (transactionReciept) => {
            //transactionResponse.hash kittumbo the second parameter of provider.once()
            //(which is a listener) will get executed. 
            console.log(`Completed with ${transactionReciept.confirmations} confirmations`)
            resolve()
        })
    })

}

async function getBalance() {
    if (metamaskExists) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }

}