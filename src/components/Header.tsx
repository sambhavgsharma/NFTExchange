import { useState, useEffect, useRef } from 'react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { WalletIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Container from './Container'
import { useWallet } from './WalletContext'
import Button from './Button'
import logo from '../assets/logo.png';

export default function Header() {
  const ref = useRef(null)
  const [isSticked, setIsSticked] = useState(false)
  const { walletAddress, connectWallet, disconnectWallet } = useWallet()

  useEffect(() => {
    const cachedRef = ref.current
    const observer = new IntersectionObserver(([e]) => setIsSticked(e.intersectionRatio < 1), {
      threshold: [1],
    })
    if (cachedRef) observer.observe(cachedRef)
    return () => {
      if (cachedRef) observer.unobserve(cachedRef)
    }
  }, [])

  const shortenAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''
  }

  return (
    <header
      ref={ref}
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        isSticked ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
              
              <nav className="hidden lg:flex lg:gap-6 ml-10">
                <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
                  Drops
                </a>
                <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
                  Stats
                </a>
                <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
                  Create
                </a>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items, collections..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
              />
            </div>

            {walletAddress ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={disconnectWallet}
                  variant="secondary"
                  className="!py-2 flex items-center gap-2"
                >
                  <WalletIcon className="h-5 w-5" />
                  {shortenAddress(walletAddress)}
                </Button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <UserCircleIcon className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                variant="primary"
                className="!py-2 flex items-center gap-2"
              >
                <WalletIcon className="h-5 w-5" />
                Connect Wallet
              </Button>
            )}

            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors sm:hidden">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
            </button>

            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}