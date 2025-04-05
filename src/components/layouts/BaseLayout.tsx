import { ReactNode } from 'react'
import Header from '../Header'

interface BaseLayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
    </>
  )
}
