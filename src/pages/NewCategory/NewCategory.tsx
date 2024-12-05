import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';

import InputMask from 'react-input-mask';
import {useNavigate} from 'react-router-dom';

interface DataType {
    userId: number,
    etransaction: string,
    name: string,
}

export const NewCategory = (user) => {
    const navigate = useNavigate()

    const [data, setData] = useState<DataType>({
        userId: user.user.id,
        etransaction: 'OUTCOME',
        name: ''})
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
            name: data.name.trim(),
        })

        console.log(data)

        if (!data.name) {
            setError('Заполните, пожалуйста, все поля')
            return
        }

        try {
            const result = await fetch('http://195.133.197.53:8080/category/create', {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            if (result.ok) {
                window.alert("Платеж записан")
                setData({userId: user.user.id, etransaction: '', name: ''})
            } else {
                alert("Ошибка, попробуйте еще раз")
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (data.name) {
            setError('')
        }
    }, [data])

    return (
        <div className={'max-w-screen-xl w-full flex flex-col justify-start my-5 ml-32 gap-5'}>
            <h2 className={'text-3xl'}>Добавление категории</h2>
            <form className={'flex flex-col gap-5'}>
                <fieldset className={'flex gap-8'} onChange={handleChangeForm} name={'etransaction'}>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 flex gap-3 items-center transition duration-500 '}>
                        <input defaultChecked type={'radio'} id={'OUTCOME'} className={'w-4 h-4'} name='etransaction' value='OUTCOME'/>
                        <label htmlFor={'OUTCOME'}>Расходы</label>
                    </div>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 flex gap-3 items-center transition duration-500 '}>
                        <input type={'radio'} id={'INCOME'} className={'w-4 h-4'} name='etransaction' value='INCOME'/>
                        <label htmlFor={'INCOME'}>Доходы</label>
                    </div>
                </fieldset>
                <label className={'flex flex-col gap-2'}>
                    <span>Название</span>
                    <input placeholder={'Введите название категории'} name={'name'} value={data.name} onChange={handleChangeForm}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                               (error && !data.name && 'border-red-500 ')}/>
                </label>
                <div className={'h-3'}>{error}</div>
                <BlueButton text={'Готово'} classname={'w-96 h-12'} onClick={handleSubmitForm}/>
            </form>
        </div>
    )
}
