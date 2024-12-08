import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';

import InputMask from 'react-input-mask';

interface DataType {
    userId: number
    type: string,
    date: string,
    amount: number | '',
    title: string,
    categoryId: number | '',
    // paymentWay: string,
    // isRecurring: boolean,
    day?: number,
    month?: number,
    year?: number,
    frequency?: number,
    createdAt?: string,
    updatedAt?: string,
}

const parseDate = (date: string) => {
    date = date.slice(0, 10)
    return date.split('-').reverse().join('/')
}

const toDateFormat = (date: string) => {
    console.log(date.split('/').reverse().join('-') + 'T12:00:00.000Z')
    return date.split('/').reverse().join('-') + 'T12:00:00.000Z'
}

export const NewPayment = (user: any) => {
    const [isRecurring, setIsRecurring] = useState<boolean>(false)


    const [data, setData] = useState<DataType>({
        userId: user.user.id,
        // isRecurring: false,
        type: 'EXPENSE',
        categoryId: '',
        // paymentWay: 'Кредитная карта',
        title: '',
        amount: '',
        date: parseDate(new Date(Date.now()).toISOString())})

    const [categories, setCategories] = useState<{id: number, name: string}[]>([])
    const [error, setError] = useState<string>('')

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch(`http://195.133.197.53:8080/category/get/${user.user.id}/${data.type}`, {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setCategories(result)
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [data.type]);

    const handleChangeForm = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
        if (e.target.name === "type") {
            setData(prevState => ({
                ...prevState,
                categoryId: ''
            }))
        }
        console.log(data)
    }

    const handleSubmitForm = async (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            title: data.title.trim(),
            createdAt: new Date(Date.now()).toISOString(),
            updatedAt: new Date(Date.now()).toISOString(),
            day: data.day ? data.day : 0,
            month: data.month ? data.month : 0,
            year: data.year ? data.year : 0
        };

        if (!data.amount || !data.date || !data.categoryId || !data.title || (isRecurring && !(data.day || data.month || data.year))) {
            setError('Заполните, пожалуйста, все поля')
            console.log(data)
            return
        }

        updatedData.date = toDateFormat(updatedData.date);

        console.log(updatedData)


        try {
            const url = isRecurring ? "http://195.133.197.53:8080/regular_transaction/register_new" : "http://195.133.197.53:8080/transaction/register_new"
            const token = localStorage.getItem("authTokenCashFlow")
            const result = await fetch(`${url}`, {
                method: "POST",
                body: JSON.stringify(updatedData),
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
                credentials: "include",
            })

            if (result.ok) {
                window.alert("Платеж записан")
                setData({userId: user.user.id, type: "EXPENSE", categoryId: '', amount: '', title: '',
                    date: parseDate(new Date(Date.now()).toISOString())})
                setIsRecurring(false)
            } else {
                setData({
                    ...data,
                    date: parseDate(data.date)
                })
                alert("Ошибка, попробуйте еще раз")

            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (data.amount && data.date && data.categoryId && data.title && (isRecurring && data.frequency)) {
            setError('')
        }
    }, [data])

    return (
        <div className={'max-w-screen-xl w-full flex flex-col justify-start my-5 ml-32 gap-5'}>
            <h2 className={'text-3xl'}>Добавление платежа</h2>
            <form className={'flex flex-col gap-5'}>
                <fieldset className={'flex gap-8'} onChange={handleChangeForm} name={'type'}>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 flex gap-3 items-center transition duration-500 '}>
                        <input defaultChecked type={'radio'} id={'EXPENSE'} className={'w-4 h-4'} checked={data.type === 'EXPENSE'} name='type' value='EXPENSE'/>
                        <label htmlFor={'EXPENSE'}>Расходы</label>
                    </div>
                    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 flex gap-3 items-center transition duration-500 '}>
                        <input type={'radio'} id={'INCOME'} className={'w-4 h-4'} checked={data.type === 'INCOME'} name='type' value='INCOME'/>
                        <label htmlFor={'INCOME'}>Доходы</label>
                    </div>
                </fieldset>
                <label className={'flex flex-col gap-2'}>
                    <span>Категория</span>
                    <select name={'categoryId'} value={data.categoryId} onChange={handleChangeForm}
                            className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3'}>
                        <option disabled/>
                        {categories.length > 0 && categories.map((category) => (
                            <option value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <label className={'flex flex-col gap-2'}>
                    <span>Название</span>
                    <input placeholder={'Введите наименование платежа'} name={'title'} value={data.title} onChange={handleChangeForm}
                           className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +
                               (error && !data.title && 'border-red-500 ')}/>
                </label>
                <div className={'flex w-1/2 gap-8'}>
                    <label className={'flex flex-col gap-2'}>
                        <span>Дата</span>
                        <InputMask value={data.date} mask={'99/99/9999'} placeholder={'ДД/ММ/ГГГГ'} onChange={handleChangeForm}
                                   name={'date'} className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 ' +
                                    (error && !data.date && 'border-red-500')}/>
                    </label>
                    <label className={'flex flex-col gap-2'}>
                        <span>Сумма</span>
                        <input placeholder={'0.00'} type={'number'} name={'amount'} value={data.amount} onChange={handleChangeForm}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-44 px-3 transition duration-500 ' +
                                   (error && !data.amount && 'border-red-500')}/>
                    </label>
                </div>
                {/*<fieldset className={'flex flex-col gap-3'} onChange={handleChangeForm} name={'paymentWay'}>*/}
                {/*    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 flex gap-3 items-center transition duration-500 ' +*/}
                {/*        (error && !data.paymentWay && 'border-red-500')}>*/}
                {/*        <input defaultChecked type={'radio'} id={'creditCard'} className={'w-4 h-4'} name='paymentWay' value='Кредитная карта'/>*/}
                {/*        <label htmlFor={'creditCard'}>Кредитная карта</label>*/}
                {/*    </div>*/}
                {/*    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 flex gap-3 items-center transition duration-500 ' +*/}
                {/*        (error && !data.paymentWay && 'border-red-500')}>*/}
                {/*        <input type={'radio'} id={'debitCard'} className={'w-4 h-4'} name='paymentWay' value='Дебетовая карта'/>*/}
                {/*        <label htmlFor={'debitCard'}>Дебетовая карта</label>*/}
                {/*    </div>*/}
                {/*    <div className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 flex gap-3 items-center transition duration-500 ' +*/}
                {/*        (error && !data.paymentWay && 'border-red-500')}>*/}
                {/*        <input type={'radio'} id={'cash'} className={'w-4 h-4'} name='paymentWay' value='Наличные'/>*/}
                {/*        <label htmlFor={'cash'}>Наличные</label>*/}
                {/*    </div>*/}
                {/*</fieldset>*/}
                <label className={'flex gap-4'}>
                    <input type={'checkbox'} name={'isRecurring'} checked={isRecurring} onChange={() => {
                        setIsRecurring((prevState) => !prevState)
                    }}
                           className={'border-gray-400 border-[1px] rounded-lg h-6 w-6 px-3 transition duration-500 '}/>
                    <span>Сделать транзакцию регулярной</span>
                </label>
                {isRecurring && <label className={'flex flex-col gap-2'}>
                    <span>Частота</span>
                    <div className={"flex gap-4 "}>
                        <input placeholder={'Дни'} type={'number'} name={'day'} value={data.day} onChange={handleChangeForm}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-28 px-3 transition duration-500 '}/>
                        <input placeholder={'Месяца'} type={'number'} name={'month'} value={data.month} onChange={handleChangeForm}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-28 px-3 transition duration-500 '}/>
                        <input placeholder={'Годы'} type={'number'} name={'year'} value={data.year} onChange={handleChangeForm}
                               className={'border-gray-400 border-[1px] rounded-lg h-12 w-28 px-3 transition duration-500 '}/>
                    </div>
                    {/*<input placeholder={'Раз во сколько дней проводить транзакцию?'} type={'number'} name={'frequency'} value={data.frequency} onChange={handleChangeForm}*/}
                    {/*       className={'border-gray-400 border-[1px] rounded-lg h-12 w-96 px-3 transition duration-500 ' +*/}
                    {/*           (error && !data.frequency && 'border-red-500')}/>*/}
                </label>}
                <div className={'h-3'}>{error}</div>
                <BlueButton text={'Готово'} classname={'w-96 h-12'} onClick={handleSubmitForm}/>
            </form>

        </div>
    )
}
