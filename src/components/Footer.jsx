import React from 'react'

const Footer = () => {
  return (
    <footer>
        <div className='container text-centre'>
            <div className='mb-2'>
                <a href="#" className='text-white text-decoration-none mx-2'>Home</a>
                <a href="#" className='text-white text-decoration-none mx-2'>About</a>
                <a href="#" className='text-white text-decoration-none mx-2'>Shop</a>
                <a href="#" className='text-white text-decoration-none mx-2'>Contact</a>
            </div>

            <div className='mb-2'>
                <a href="#" className='text-white mx-2'>Facebook</a>
                <a href="#" className='text-white mx-2'>Twitter</a>
                <a href="#" className='text-white mx-2'>Instagram</a>
            </div>

            <p className='small mb-0'> 2024 Shoppit</p>
        </div>
    </footer>
  )
}

export default Footer