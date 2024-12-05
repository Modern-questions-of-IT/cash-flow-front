import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

interface DataType {
    email: string;
    password: string
}

export const LoginPage = () => {
    const [data, setData] = useState<DataType>({email: '', password: ''})
    const [error, setError] = useState<string>('')

    const navigate = useNavigate()

    const handleChangeForm = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setData({
            ...data,
            email: data.email.trim(),
        })

        if (data.email === '' || data.password === '') {
            setError('Заполните, пожалуйста, все поля')
            return
        }

        const response = await fetch("http://195.133.197.53:8080/auth/sign-in", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const res = await response.json()
            console.log(res)
            localStorage.setItem("authToken", res.token)
            navigate("/general_overview")
        } else {
            setError("Ошибка, попробуйте еще раз")
        }

    }

    useEffect(() => {
        if (error && data.email !== '' && data.password !== '') {
            setError('')
        }
    }, [data])

    return (
        <div className={'max-w-screen-xl mx-auto'}>
            <div className={'flex flex-col gap-8 text-center w-full my-10'}>
                <h1 className={'text-3xl'}>Добро пожаловать в Cash Flow</h1>
                <p>Вход</p>
                <form className={'flex flex-col mx-10 gap-5 items-center relative'}>
                    <label className={'flex flex-col text-start gap-2'}>
                        <span>Email</span>
                        <input name={'email'} value={data.email} onChange={handleChangeForm}
                               placeholder={'you@example.com'}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                                   (error && data.email === '' && ' border-red-500 ')}/>
                    </label>
                    <label className={'flex flex-col text-start gap-2'}>
                        <span>Пароль</span>
                        <input name={'password'} value={data.password} type={'password'} onChange={handleChangeForm}
                               placeholder={'Введите пароль'}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                                   (error && data.password === '' && ' border-red-500 ')}/>
                    </label>
                    <div className={'absolute bottom-12'}>{error}</div>
                    <BlueButton text={'Вход'} classname={'mt-3 h-10 w-1/2'} onClick={handleSubmit}/>

                    {/*<div>Ещё нет аккаунта? <Link to={"/registration"} className={"text-blue-400"}>Регистрация</Link></div>*/}
                </form>
            </div>
        </div>
    )
}
