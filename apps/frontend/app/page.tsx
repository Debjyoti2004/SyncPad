"use client"

import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Features }  from './components/Features'
import React from 'react'

const page = () => {


  return (
      <>
      <Navbar />
      <Hero />
      <Features/>
      <Footer />
      </>
  )
}

export default page