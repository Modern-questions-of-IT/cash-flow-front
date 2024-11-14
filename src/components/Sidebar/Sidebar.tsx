import {Link, useNavigate} from 'react-router-dom';
import {BlueButton} from '../BlueButton/BlueButton.tsx';

const items = [
    {id: 1, title: 'Общий обзор', img: './summary.svg', link: '#'},
    {id: 2, title: 'Переводы', img: './transfer.svg', link: '#'},
    {id: 3, title: 'Чеки', img: './bill.svg', link: '#'},
    {id: 4, title: 'Доходы', img: './payments.svg', link: '#'},
    {id: 5, title: 'Повторяющиеся платежи', img: './replay.svg', link: '#'},
    {id: 6, title: 'Платежи', img: './payments.svg', link: '#'}
]

export const Sidebar = () => {
    const navigate = useNavigate()

    return (
        <div className={'flex my-0'}>
            <div className={'flex flex-col w-[250px] h-[85vh] justify-between items-start mt-5 ml-2 gap-10'}>
                <div className={'flex flex-col gap-3'}>
                    {items.map(item =>
                        <Link to={item.link} className={'flex gap-3 p-2 py-3 items-center rounded-md hover:bg-gray-100 transform duration-500'}>
                            <img src={item.img} alt={'icon'}/>
                            <span>{item.title}</span>
                        </Link>
                    )}
                </div>
                <BlueButton text={'Новый платеж'} classname={'h-9 w-56'} onClick={() => navigate('/new_payment')}/>
            </div>
        </div>
    )
}

