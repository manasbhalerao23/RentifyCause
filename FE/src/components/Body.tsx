
import Footer from './Footer';
import Header from './Header'
import { Outlet } from 'react-router-dom'


 const Body = () => {

  return (
    <div className='flex flex-col min-h-screen'>
        <Header/>
        <main className='flex-1 '>
          <div className='relative'>
              <Outlet/>
          </div>
        </main>
        {/* footer compo */}
          <Footer/>
    </div>
  )
}


export default Body;