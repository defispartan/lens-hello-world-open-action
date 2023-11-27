import { ReactNode } from "react"
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'

const projectId = '4fd06e4b38442f90da013ff3f7edd94c'

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [polygonMumbai]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

interface Props {
  children?: ReactNode
}

export function WalletConnectProvider({ children }: Props) {
  return (
    <WagmiConfig config={wagmiConfig}>
        { children }
    </WagmiConfig>
  )
}