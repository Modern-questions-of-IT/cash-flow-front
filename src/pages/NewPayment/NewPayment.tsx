import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';

import InputMask from 'react-input-mask';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

interface DataType {
    date: string,
    price: number | '',
    store: string,
    category: string,
    paymentWay: string
}

const parseDate = (date: string) => {
    date = date.slice(0, 10)
    return date.split('-').reverse().join('/')
}

const toDateFormat = (date: string) => {
    console.log(date.split('/').reverse().join('-') + 'T12:00:00.000Z')
    return date.split('/').reverse().join('-') + 'T12:00:00.000Z'
}

export const NewPayment = () => {
    const navigate = useNavigate()

    const [data, setData] = useState<DataType>(
        {category: 'Образование', paymentWay: 'Кредитная карта', price: '', store: '', date: parseDate(new Date(Date.now()).toISOString())})
    const [error, setError] = useState<string>('')

    const handleChangeForm = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
        console.log(data)
    }

    const handleSubmitForm = async (e: any) => {
        e.preventDefault();
        setData({
            ...data,
            store: data.store.trim(),
        })

        if (!data.store || !data.price || !data.paymentWay || !data.date) {
            setError('Заполните, пожалуйста, все поля')

            return
        }

        setData({
            ...data,
            date: toDateFormat(data.date)
        })

        await axios.postForm("", data, {headers: {'Content-Type': 'application/json'}}).then((res) => {
            console.log(res)
            navigate('/')
        })
    }

    useEffect(() => {
        if (data.store && data.price && data.paymentWay && data.date) {
            setError('')
        }
    }, [data])

    return (
        <div className={'max-w-screen-xl w-full flex flex-col justify-start my-5 ml-32 gap-5'}>
            <h2 className={'text-3xl'}>Добавление платежа</h2>
            <form className={'flex flex-col gap-5'}>
                <div className={'flex w-1/2 gap-8'}>
                    <label className={'flex flex-col gap-2'}>
                        <span>Дата платежа</span>
                        <InputMask value={data.date} mask={'99/99/9999'} placeholder={'ДД/ММ/ГГГГ'} onChange={handleChangeForm}
                                   name={'date'} className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 ' +
                                    (error && !data.date && 'border-red-500')}/>
                    </label>
                    <label className={'flex flex-col gap-2'}>
                        <span>Сумма</span>
                        <input placeholder={'0.00'} type={'number'} name={'price'} value={data.price} onChange={handleChangeForm}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 transition duration-500 ' +
                                   (error && !data.price && 'border-red-500')}/>
                    </label>
                </div>
                <label className={'flex flex-col gap-2'}>
                    <span>Продавец</span>
                    <input placeholder={'Где вы совершили данный платеж?'} name={'store'} value={data.store} onChange={handleChangeForm}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                               (error && !data.store && 'border-red-500 ')}/>
                </label>
                <label className={'flex flex-col gap-2'}>
                    <span>Категория</span>
                    <select name={'category'} value={data.category} onChange={handleChangeForm}
                            className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3'}>
                        <option value={'Образование'}>Образование</option>
                        <option value={'Продукты'}>Продукты</option>
                        <option value={'Ресторан'}>Ресторан</option>
                    </select>
                </label>
                <fieldset className={'flex flex-col gap-3'} onChange={handleChangeForm} name={'paymentWay'}>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 flex gap-3 items-center transition duration-500 ' +
                        (error && !data.paymentWay && 'border-red-500')}>
                        <input defaultChecked type={'radio'} id={'creditCard'} className={'w-4 h-4'} name='paymentWay' value='Кредитная карта'/>
                        <label htmlFor={'creditCard'}>Кредитная карта</label>
                    </div>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 flex gap-3 items-center transition duration-500 ' +
                        (error && !data.paymentWay && 'border-red-500')}>
                        <input type={'radio'} id={'debitCard'} className={'w-4 h-4'} name='paymentWay' value='Дебетовая карта'/>
                        <label htmlFor={'debitCard'}>Дебетовая карта</label>
                    </div>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 flex gap-3 items-center transition duration-500 ' +
                        (error && !data.paymentWay && 'border-red-500')}>
                        <input type={'radio'} id={'cash'} className={'w-4 h-4'} name='paymentWay' value='Наличные'/>
                        <label htmlFor={'cash'}>Наличные</label>
                    </div>
                </fieldset>
                <div className={'h-3'}>{error}</div>
                <BlueButton text={'Готово'} classname={'w-96 h-12'} onClick={handleSubmitForm}/>
            </form>

        </div>
    )
}
