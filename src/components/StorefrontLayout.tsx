import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <CartDrawer />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
