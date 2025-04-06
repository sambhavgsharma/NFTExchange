import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  walletAddress: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: '',
  connectWallet: async () => {},
  disconnectWallet: () => {}
})

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask')
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setWalletAddress(accounts[0])
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        setWalletAddress(newAccounts[0] || '')
      })
    } catch (err) {
      console.error('Wallet connection error:', err)
      throw err
    }
  }

  const disconnectWallet = () => {
    setWalletAddress('')
  }

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext);