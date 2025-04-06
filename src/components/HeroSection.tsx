import { CAROUSEL_ITEMS } from '@/consts'
import { Dispatch, SetStateAction, useState } from 'react'
import { Autoplay, Mousewheel, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Container from './Container'
import { ethers } from 'ethers'
import contractABI from '../../abi/contractABI.json'
import Button from './Button'
import { WalletIcon } from '@heroicons/react/24/solid'
import { useWallet } from './WalletContext'

// Constants
const PINATA_API_KEY = "eafb166f203222925221"
const PINATA_SECRET_API_KEY = "21b864d8ab68e3d967644e4ce96391ae659ec1b0c8cc7433c769265b61ec9439"
const CONTRACT_ADDRESS = "0xb0305BE644CA9446E269EA75F3BDF36a4f44E39a"

interface CarouselItem {
  image: string
  name: string
  floor: string
}

export default function HeroSection() {
  const [background, setBackground] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(CAROUSEL_ITEMS)
  const { walletAddress, connectWallet } = useWallet()

  const handleNewNFT = (newItem: CarouselItem) => {
    setCarouselItems(prev => [...prev, newItem])
  }

  return (
    <div className="relative">
      {/* Background image with gradient overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-[background] duration-1000 after:absolute after:inset-0 after:z-10 after:bg-gradient-to-b after:from-transparent after:to-gray-900/90"
        style={{ backgroundImage:  "url(/carousel/image.jpg)" }}
      />
      
      {/* Hero content */}
      <div className="relative z-20 pt-32 pb-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-6">
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              The world's first and largest digital marketplace for crypto collectibles and non-fungible tokens
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="!px-8 !py-3 !text-base">
                Explore
              </Button>
              {walletAddress ? (
                <Button 
                  onClick={() => setShowModal(true)}
                  variant="secondary" 
                  className="!px-8 !py-3 !text-base"
                >
                  Create
                </Button>
              ) : (
                <Button 
                  onClick={connectWallet}
                  variant="secondary" 
                  className="!px-8 !py-3 !text-base flex items-center gap-2"
                >
                  <WalletIcon className="h-5 w-5" />
                  Connect to Create
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Featured NFTs Carousel */}
      <Container className="relative z-20 px-0 sm:px-4 -mt-12">
        <Swiper
          modules={[Navigation, Autoplay, Mousewheel]}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          mousewheel={{ invert: false, forceToAxis: true }}
          onSlideChange={(e) => setBackground(e.realIndex)}
          navigation
          breakpoints={{
            0: { 
              slidesPerView: 'auto', 
              spaceBetween: 16, 
              centeredSlides: true 
            },
            640: { 
              slidesPerView: 2, 
              spaceBetween: 24, 
              centeredSlides: false 
            },
            1024: { 
              slidesPerView: 3, 
              spaceBetween: 24 
            },
            1280: { 
              slidesPerView: 4, 
              spaceBetween: 24 
            },
          }}
          className="!pb-12"
        >
          {carouselItems.map((item, i) => (
            <SwiperSlide key={i} className="!h-auto">
              <div className="group relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={item.name}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">Floor: {item.floor}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* Create NFT Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create NFT</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <CreateNFTForm 
                closeModal={() => setShowModal(false)} 
                onNFTMinted={handleNewNFT} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CreateNFTForm({
  closeModal,
  onNFTMinted
}: {
  closeModal: () => void
  onNFTMinted: (item: CarouselItem) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [nftName, setNftName] = useState("")
  const [nftDescription, setNftDescription] = useState("")
  const [nftSymbol, setNftSymbol] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !nftName || !nftDescription || !nftSymbol) {
      alert("Please fill all fields and select an image")
      return
    }

    try {
      setLoading(true)
      
      // Upload file to IPFS via Pinata
      const fileData = new FormData()
      fileData.append("file", file)

      const fileRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        },
        body: fileData
      })
      
      if (!fileRes.ok) throw new Error("Failed to upload image to IPFS")
      const fileResult = await fileRes.json()
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${fileResult.IpfsHash}`

      // Create and upload metadata
      const metadata = {
        name: nftName,
        symbol: nftSymbol,
        description: nftDescription,
        image: imageUrl
      }

      const metaRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        },
        body: JSON.stringify(metadata)
      })
      
      if (!metaRes.ok) throw new Error("Failed to upload metadata to IPFS")
      const metaResult = await metaRes.json()
      const metadataUrl = `ipfs://${metaResult.IpfsHash}`

      // Connect to Ethereum and mint NFT
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
      const tx = await contract.mintNFT(await signer.getAddress(), metadataUrl)
      await tx.wait()

      // Add to carousel
      onNFTMinted({
        image: imageUrl,
        name: nftName,
        floor: "0.03 ETH"
      })

      alert("NFT Minted Successfully!")
      closeModal()
    } catch (err) {
      console.error("Minting error:", err)
      alert(`Failed to mint NFT: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleMintNFT} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NFT Name</label>
        <input
          type="text"
          value={nftName}
          onChange={(e) => setNftName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NFT Symbol</label>
        <input
          type="text"
          value={nftSymbol}
          onChange={(e) => setNftSymbol(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
          maxLength={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={nftDescription}
          onChange={(e) => setNftDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NFT Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-lg mb-2"
                />
                <p className="text-xs text-gray-500">{file?.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setPreviewUrl("")
                  }}
                  className="mt-2 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={closeModal}
          variant="outline"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Minting...
            </>
          ) : 'Mint NFT'}
        </Button>
      </div>
    </form>
  )
}