import { ethers } from 'ethers'
import contractABI from '../../abi/contractABI.json'
import { CarouselItem } from '@/consts'
import Container from './Container'
import { Autoplay, Mousewheel, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useWallet } from './WalletContext'
import { useEffect, useState } from 'react'
import Button from './Button'
import { WalletIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon } from '@heroicons/react/24/solid'

const CONTRACT_ADDRESS = "0xb0305BE644CA9446E269EA75F3BDF36a4f44E39a"

export default function UserNFTs() {
  const [userNFTs, setUserNFTs] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { walletAddress, connectWallet } = useWallet()

  const fetchNFTs = async () => {
    if (!walletAddress) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS, 
        contractABI,
        provider
      )

      const balance = await contract.balanceOf(walletAddress)
      const nfts: CarouselItem[] = []
      
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i)
        const tokenURI = await contract.tokenURI(tokenId)
        
        // Fetch metadata from IPFS
        const ipfsUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        const metadataResponse = await fetch(ipfsUrl)
        
        if (!metadataResponse.ok) {
          throw new Error(`Failed to fetch metadata for token ${tokenId}`)
        }
        
        const metadata = await metadataResponse.json()
        
        nfts.push({
          id: tokenId.toString(),
          image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
          name: metadata.name,
          description: metadata.description,
          floor: metadata.floor || "0.03 ETH"
        })
      }

      setUserNFTs(nfts)
    } catch (err) {
      console.error("Error fetching NFTs:", err)
      setError(err instanceof Error ? err.message : "Failed to load NFTs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNFTs()
  }, [walletAddress])

  if (!walletAddress) {
    return (
      <Container className="py-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="flex flex-col items-center">
            <WalletIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-500 mb-6">
              Connect your wallet to view your NFT collection
            </p>
            <Button 
              onClick={connectWallet}
              variant="primary"
              className="!px-6 !py-3 flex items-center gap-2"
            >
              <WalletIcon className="h-5 w-5" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container className="py-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <ArrowPathIcon className="h-12 w-12 text-purple-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Your NFTs
          </h2>
          <p className="text-gray-500">
            Fetching your digital collection...
          </p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="flex flex-col items-center">
            <svg 
              className="h-12 w-12 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Error Loading NFTs
            </h2>
            <p className="text-gray-500 mb-4">
              {error}
            </p>
            <Button 
              onClick={fetchNFTs}
              variant="primary"
              className="!px-6 !py-3 flex items-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (userNFTs.length === 0) {
    return (
      <Container className="py-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="flex flex-col items-center">
            <ShoppingBagIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No NFTs Found
            </h2>
            <p className="text-gray-500 mb-6">
              You don't have any NFTs in your wallet yet
            </p>
            <Button 
              variant="primary"
              className="!px-6 !py-3"
              onClick={() => window.location.href = '/create'}
            >
              Create Your First NFT
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Collection</h2>
          <p className="text-gray-500">
            {userNFTs.length} {userNFTs.length === 1 ? 'NFT' : 'NFTs'} in your wallet
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={fetchNFTs}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="primary"
            onClick={() => window.location.href = '/create'}
          >
            Create New
          </Button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={24}
        navigation
        breakpoints={{
          0: {
            slidesPerView: 1,
            centeredSlides: true,
            spaceBetween: 16
          },
          640: {
            slidesPerView: 2,
            centeredSlides: false
          },
          1024: {
            slidesPerView: 3
          },
          1280: {
            slidesPerView: 4
          }
        }}
        className="!pb-12"
      >
        {userNFTs.map((nft, i) => (
          <SwiperSlide key={i} className="!h-auto">
            <div className="group relative h-full bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img
                  src={nft.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={nft.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-nft.png'
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{nft.name}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{nft.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="!px-3 !py-1.5 !text-sm flex-1"
                    onClick={() => window.open(nft.image, '_blank')}
                  >
                    View
                  </Button>
                  <Button 
                    variant="primary" 
                    className="!px-3 !py-1.5 !text-sm flex-1"
                    onClick={() => {
                      // Implement sell functionality
                      alert(`Preparing to sell ${nft.name}`)
                    }}
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  )
}