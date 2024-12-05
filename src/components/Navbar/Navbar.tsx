import {Link} from 'react-router-dom';
import {BlueButton} from '../BlueButton/BlueButton.tsx';

export const Navbar = (user: any) => {

    return (
        <header className={'w-full'}>
            <div className={'max-w-screen-xl flex justify-between h-14 mx-auto my-0 items-center px-10'}>
                <div className={'flex gap-5'}>
                    <img src={'./logo.svg'} alt={'logo'} className={'h-7'}/>
                    <h3 className={'text-center self-center text-lg'}>Cash Flow</h3>
                </div>
                <div>
                    {user ?
                        <div className={'flex gap-5'}>
                            <Link to={'/report'} className={'self-center text-sm'}>
                                Отчет
                            </Link>
                            {/*<Link to={'#'} className={'self-center text-sm'}>*/}
                            {/*    Налоги*/}
                            {/*</Link>*/}
                            <Link to={'/profile_settings'} className={'rounded-full bg-gray-300 h-7 w-7 flex justify-center items-center ml-5'}>
                                <img src={'./settings.svg'} alt={'logo'} className={'h-5'}/>
                            </Link>
                        </div>
                        :
                        <BlueButton text={'Вход'} classname={'w-20 h-8'}/>
                    }
                </div>
            </div>
            <hr className={'h-1'}/>
        </header>
    )
}
