import {CircleUserRound, Facebook, Twitter, Youtube} from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
    return(
        <header>
            <div className='flex justify-between items-center px-6 py-2 text-sm bg-red-600'>
                <div className='flex space-x-4 '>
                    <button className='cursor-pointer'>
                        Hindi
                    </button>
                </div>
                <div className='cursor-pointer flex space-x-3'>
                    <Twitter/>
                    <Facebook/>
                    <Youtube/>
                </div>
            </div>
            {/*main part*/}
            <div className=' flex justify-between items-center px-6 py-6 bg-red-100 text-black border-b-2 border-red-200'>
                <div className='flex items-center space-x-4'>
                    <div>
                        <h1 className='text-xl font-bold'>
                           <Link to="/"> Red Cross</Link>
                        </h1>
                        <p className='text-sm'>
                            indore,mp.
                        </p>
                    </div>
                </div>
                <div className='flex space-x-3 items-center gap-7'>
                    <button className='bg-red-600 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-teal-500 transition duration-500 animate-pulse ease-in-out '>
                        Rent
                    </button>
                    <button className='rounded-md flex gap-1 font-medium cursor-pointer'>
                        <CircleUserRound/>
                        Profile
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;