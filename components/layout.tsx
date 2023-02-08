import React from 'react'
import Head from 'next/head' 
import { BlankDiv } from './blankDiv'

interface WrapperProps {
  children: React.ReactNode
}

function Layout({ children }: WrapperProps) {
  return (
    <>
      <Head>
        <title>HiZollo 四週年搶旗活動</title>
        <link rel="favicon" href="favicon.ico" />
      </Head>
      <BlankDiv height="100px" />
      <main id="content">
        {children}
        <BlankDiv />
      </main>
      <BlankDiv height="100px" />
    </>
  )
}

export { Layout }
