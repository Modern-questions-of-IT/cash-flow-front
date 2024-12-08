import {Link, useNavigate} from 'react-router-dom';
import {BlueButton} from '../BlueButton/BlueButton.tsx';

const items = [
    {id: 1, title: 'Общий обзор', img: './summary.svg', link: '/transactions/all'},
    {id: 2, title: 'Доходы', img: './payments.svg', link: '/transactions/income'},
    {id: 3, title: 'Регулярные доходы', img: './replay.svg', link: '/regular/income'},
    {id: 4, title: 'Расходы', img: './payments.svg', link: '/transactions/expense'},
    {id: 5, title: 'Регулярные расходы', img: './replay.svg', link: '/regular/expense'},
]

export const Sidebar = () => {
    const navigate = useNavigate()

    return (
        <div className={'flex my-0'}>
            <div className={'flex flex-col w-[250px] h-[85vh] max-h-[540px] justify-between items-start mt-5 ml-2 gap-10'}>
                <div className={'flex flex-col gap-3'}>
                    {items.map(item =>
                        <Link to={item.link} className={'flex gap-3 p-2 py-3 items-center rounded-md hover:bg-gray-100 transform duration-500'}>
                            <img src={item.img} alt={'icon'}/>
                            <span>{item.title}</span>
                        </Link>
                    )}
                </div>
                <div className={'flex flex-col gap-3'}>
                    <BlueButton text={'Новая транзакция'} classname={'min-h-9 w-56'} onClick={() => navigate('/new_payment')}/>
                    <BlueButton text={'Новая категория'} classname={'min-h-9 w-56'} onClick={() => navigate('/new_category')}/>
                </div>
            </div>
        </div>
    )
}

