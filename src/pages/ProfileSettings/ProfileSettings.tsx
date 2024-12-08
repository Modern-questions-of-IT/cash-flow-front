import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

export const ProfileSettings = (user: any) => {
    console.log(user)

    const navigate = useNavigate()

    const [email, _] = useState<string>(user.user.email)
    const [error, setError] = useState<string>('')

    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: ''
    })

    const [name, setName] = useState<string>(user.user.name)

    // useEffect(() => {
    //     (async function () {
    //         try {
    //             const token = localStorage.getItem("authTokenCashFlow")
    //             const response = await fetch(`http://195.133.197.53:8080/auth/info`, {
    //                 method: "GET",
    //                 credentials: "include",
    //                 headers: { 'Content-Type': 'application/json',  "Authorization": `Bearer ${token}` },
    //             })
    //             let result = await response.json()
    //             console.log(result)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     })()
    // }, []);

    const handleChangePassword = (e: any) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
        console.log(password)
    }

    const handleSubmitPassword = async (e: any) => {
        e.preventDefault();
        // setData({
        //     ...data,
        //     name: data.name.trim(),
        // })

        // if (!data.name) {
        //     setError('Заполните, пожалуйста, все поля')
        //     return
        // }

        try {
            const token = localStorage.getItem("authTokenCashFlow")
            const result = await fetch('http://195.133.197.53:8080/auth/change-password', {
                method: "PUT",
                body: JSON.stringify(password),
                headers: { 'Content-Type': 'application/json',  "Authorization": `Bearer ${token}` },
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

    const handleSubmitName = async (e: any) => {
        e.preventDefault();
        setName(name.trim())

        if (!name) {
            setError('Имя не должно быть пустым')
            return
        }

        try {
            const token = localStorage.getItem("authTokenCashFlow")
            console.log(name)
            const result = await fetch('http://195.133.197.53:8080/auth/change-username', {
                method: "PUT",
                body: JSON.stringify({ name: name}),
                headers: { 'Content-Type': 'application/json',  "Authorization": `Bearer ${token}` },
                credentials: "include",
            })

            const res = await result.json()

            if (result.ok) {
                window.alert("Изменения сохранены")
                localStorage.setItem("authTokenCashFlow", res.token)
                // setData({etransaction: '', name: ''})
            } else {
                alert("Ошибка, попробуйте еще раз")
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (name) {
            setError('')
        }
    }, [name])

    return (
        <div className={'max-w-screen-xl w-full flex flex-col justify-start my-5 ml-32 gap-5'}>
            <h2 className={'text-3xl'}>Настройки профиля</h2>
            <form className={'flex flex-col gap-5'}>
                <label className={'flex flex-col gap-2'}>
                    <span>Username</span>
                    <input disabled value={email}
                           className={'border-gray-400 text-gray-500 bg-gray-200 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 '}/>
                    <span>Имя</span>
                    <input placeholder={'Введите имя'} name={'name'} value={name}
                           onChange={(e: any) => setName(e.target.value)}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                               (error && !name && 'border-red-500 ')}/>
                    <BlueButton text={'Сохранить имя'} classname={'w-96 h-12 mt-8 mb-10'}
                                onClick={handleSubmitName}
                    />
                    <span>Старый пароль</span>
                    <input placeholder={'Введите старый пароль'} name={'oldPassword'} value={password.oldPassword} onChange={handleChangePassword}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 '}/>
                    <span>Новый пароль</span>
                    <input placeholder={'Введите новый пароль'} name={'newPassword'} value={password.newPassword} onChange={handleChangePassword}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 '}/>
                </label>
                <div className={'h-3'}>{error}</div>
                <BlueButton text={'Изменить пароль'} classname={'w-96 h-12'} onClick={handleSubmitPassword}/>
            </form>

            <BlueButton text={"Выйти из аккаунта"} classname={'w-96 h-12'} onClick={() => {localStorage.removeItem("authTokenCashFlow"); navigate('/login'); window.location.reload()}}/>
        </div>
    )
}
