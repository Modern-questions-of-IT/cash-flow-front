import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';

import InputMask from 'react-input-mask';
import {useNavigate} from 'react-router-dom';

interface DataType {
    username: string,
    name: string,
    password: string
}

export const ProfileSettings = (user) => {
    console.log(user)
    const navigate = useNavigate()

    const [data, setData] = useState<DataType>({
        username: user.user.email,
        name: user.user.name,
        password: ''
    })
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
            const result = await fetch('', {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            if (result.ok) {
                window.alert("Изменения сохранены")
                // setData({etransaction: '', name: ''})
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
                <label className={'flex flex-col gap-2'}>
                    <span>Username</span>
                    <input disabled value={data.username} onChange={handleChangeForm}
                           className={'border-gray-400 text-gray-500 bg-gray-200 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 '}/>
                    <span>Имя</span>
                    <input placeholder={'Введите имя'} name={'name'} value={data.name} onChange={handleChangeForm}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                               (error && !data.name && 'border-red-500 ')}/>
                    <span>Новый пароль</span>
                    <input placeholder={'Введите новый пароль'} name={'name'} value={data.password} onChange={handleChangeForm}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 '}/>
                </label>
                <div className={'h-3'}>{error}</div>
                <BlueButton text={'Сохранить изменения'} classname={'w-96 h-12'} onClick={handleSubmitForm}/>
            </form>
        </div>
    )
}
