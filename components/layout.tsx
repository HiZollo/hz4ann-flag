import React from 'react'
import Head from 'next/head' 
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BlankDiv } from './blankDiv'
import { Button } from './button'

interface WrapperProps {
  children: React.ReactNode
}

function Layout({ children }: WrapperProps) {
  const router = useRouter()
  const { pathname } = router

  return (
    <>
      <Head>
        <title>HiZollo 四週年搶旗活動</title>
        <link rel="favicon" href="favicon.ico" />
      </Head>
      <BlankDiv height="100px" />
      <main id="content">
        {children}
        { pathname !== '/'  && <Link href="/"><Button text="回首頁" /></Link> }
        <BlankDiv />
      </main>
      <BlankDiv height="100px" />
    </>
  )
}

export { Layout }
