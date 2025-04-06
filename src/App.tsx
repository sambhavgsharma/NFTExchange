import CollectionsSection from './components/CollectionsSection'
import HeroSection from './components/HeroSection'
import BaseLayout from './components/layouts/BaseLayout'
import Header from './components/Header'
import UserNFTs from './components/UserNFTs'
import { WalletProvider } from './components/WalletContext'
function App() {
  return (
    <WalletProvider>
    <BaseLayout>
    <Header/>
      <HeroSection />
      <UserNFTs/>
      <CollectionsSection title="Notable Collections" />
      <CollectionsSection title="Top Collector Buys Today" />
      <CollectionsSection title="LGBTQIA+ Pride Month Creator Spotlight" />
      <CollectionsSection title="Trending in Art" />
      <CollectionsSection title="Trending in Gaming" />
      <CollectionsSection title="Trending in Memberships" />
    </BaseLayout>
    </WalletProvider>

  )
}

export default App
