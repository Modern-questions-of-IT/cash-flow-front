import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';

interface DataType {
    name: string;
    email: string;
    currency: string;
    password: string
}

export const WelcomePage = () => {
    const [data, setData] = useState<DataType>({name: '', email: '', currency: 'RUB', password: ''})
    const [agree, setAgree] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleChangeForm = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setData({
            ...data,
            name: data.name.trim(),
            email: data.email.trim(),
        })

        if (data.name === '' || data.email === '' || data.password === '' || !agree) {
            setError('Заполните, пожалуйста, все поля')
        }
    }

    useEffect(() => {
        if (error && data.name !== '' && data.email !== '' && data.password !== '' && agree) {
            setError('')
        }
    }, [data, agree])

    return (
        <div className={'max-w-screen-xl mx-auto'}>
            <div className={'flex flex-col gap-8 text-center w-full my-10'}>
                <h1 className={'text-3xl'}>Добро пожаловать в Cash Flow</h1>
                <p>Твое финансовое здоровье в одном месте. Зарегестрируйтесь и начните бесплатно.</p>
                <form className={'flex flex-col mx-10 gap-5 items-center relative'}>
                    <label className={'flex flex-col text-start gap-2'}>
                        <span>Имя</span>
                        <input name={'name'} value={data.name} onChange={handleChangeForm}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                                   (error && data.name === '' && ' border-red-500') }/>
                    </label>
                    <label className={'flex flex-col text-start gap-2'}>
                        <span>Email</span>
                        <input name={'email'} value={data.email} onChange={handleChangeForm}
                               placeholder={'you@example.com'}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                                   (error && data.email === '' && ' border-red-500 ')}/>
                    </label>
                    <label className={'flex flex-col text-start gap-2'}>
                        <span>Валюта</span>
                        <select name={'currency'} value={data.currency} onChange={handleChangeForm} className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3'}>
                            <option>RUB</option>
                            <option>USD</option>
                            <option>EUR</option>
                        </select>
                    </label>
                    <label className={'flex flex-col text-start gap-2'}>
                        <span>Пароль</span>
                        <input name={'password'} value={data.password} type={'password'} onChange={handleChangeForm}
                               placeholder={'Создайте пароль'}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                                   (error && data.password === '' && ' border-red-500 ')}/>
                    </label>
                    <label className={'flex gap-3 items-center'}>
                        <input type={'checkbox'} className={'h-5 w-5'}
                               checked={agree} onChange={() => setAgree(prev => !prev)}/>
                        <span className={'transition duration-500 ' + (error && !agree ? 'text-red-500 ': '')}>Я согласен с тем, что потеряю все деньги на проекте Cash Flow</span>
                    </label>
                    <div className={'absolute bottom-12'}>{error}</div>
                    <BlueButton text={'Регистрация'} classname={'mt-3 h-10 w-1/2'} onClick={handleSubmit}/>
                </form>
            </div>
        </div>
    )
}
