import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://alrahma.store'),
  title: {
    default: 'متجر الرحمة | أرخص أدوات مدرسية في المغرب',
    template: '%s | متجر الرحمة',
  },
  description:
    'متجر الرحمة — أرخص متجر للأدوات المدرسية في المغرب. أسعار تبدأ من 3 دراهم. توصيل لجميع أنحاء المغرب. وفّر أكثر من 70% مقارنة بالمتاجر الأخرى.',
  keywords: [
    'أدوات مدرسية رخيصة المغرب',
    'متجر مستلزمات مدرسية بالمغرب',
    'أرخص مستلزمات مدرسية',
    'دفاتر أقلام مدرسية المغرب',
    'school supplies Morocco cheap',
    'fournitures scolaires maroc pas cher',
    'alrahma store',
    'متجر الرحمة',
  ],
  authors: [{ name: 'متجر الرحمة', url: 'https://alrahma.store' }],
  creator: 'متجر الرحمة',
  publisher: 'متجر الرحمة',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_MA',
    url: 'https://alrahma.store',
    siteName: 'متجر الرحمة',
    title: 'متجر الرحمة | أرخص أدوات مدرسية في المغرب',
    description: 'أسعار تبدأ من 3 دراهم. وفّر أكثر من 70%. توصيل لجميع المغرب.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'متجر الرحمة - أرخص أدوات مدرسية في المغرب',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'متجر الرحمة | أرخص أدوات مدرسية في المغرب',
    description: 'أسعار تبدأ من 3 دراهم. وفّر أكثر من 70%. توصيل لجميع المغرب.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://alrahma.store',
    languages: {
      'ar-MA': 'https://alrahma.store',
    },
  },
  verification: {
    google: '', // Add Google Search Console verification here
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* JSON-LD: Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://alrahma.store/#organization',
                  name: 'متجر الرحمة',
                  url: 'https://alrahma.store',
                  logo: 'https://alrahma.store/logo.png',
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+212603323433',
                    contactType: 'customer service',
                    availableLanguage: ['Arabic', 'French'],
                  },
                  areaServed: {
                    '@type': 'Country',
                    name: 'Morocco',
                  },
                  description:
                    'أرخص متجر للأدوات المدرسية في المغرب. أسعار تبدأ من 3 دراهم مع توصيل لجميع أنحاء المغرب.',
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://alrahma.store/#website',
                  url: 'https://alrahma.store',
                  name: 'متجر الرحمة',
                  publisher: { '@id': 'https://alrahma.store/#organization' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://alrahma.store/products?search={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
