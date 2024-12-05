import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {useParams} from "react-router-dom";
interface DataType {
    createdAt: string;
    categoryName: string;
    title: string | null;
    amount: number;
    etransaction: string
}

export const RegularTransactions = (user: any) => {
    const [data, setData] = useState<DataType[]>([])

    const {type} = useParams()
    // const [fromDate, setFromDate] = useState<Date | null>(null);
    // const [toDate, setToDate] = useState<Date | null>(null);


    useEffect(() => {
        console.log(data)
        console.log(user)
    })

    useEffect(() => {
        (async function() {
            try {

                const response = await fetch("", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                console.log(error)
            }
        }())
    }, [])

    // const handleFetchData = async () => {
    //     const sendData = {
    //         userId: user.user.id,
    //         //@ts-ignore
    //         fromDate: fromDate && (new Date(fromDate)).toISOString(),
    //         //@ts-ignore
    //         toDate: toDate && (new Date(toDate)).toISOString(),
    //     }
    //
    //     console.log(sendData)
    //     // console.log((new Date(startDate)).toISOString())
    //     try {
    //         const result = await fetch('http://195.133.197.53:8889/transaction/getByTime', {
    //             method: "POST",
    //             body: JSON.stringify(sendData),
    //             headers: { 'Content-Type': 'application/json' },
    //             credentials: "include",
    //         })
    //
    //         if (result.ok) {
    //             setData(await result.json())
    //         }
    //
    //
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }


    return (
        <div className={'max-w-screen-xl mx-auto'}>
            <div className={'flex flex-col gap-8 text-center w-full my-10'}>
                <h1 className={'text-3xl'}>Регулярные {type === "income" ? <p>доходы</p> : <p>расходы</p>}</h1>
                <table className={"w-[60vw] rounded-t-xl overflow-hidden"}>
                    <thead className={"bg-gray-300 h-12 font-bold"}>
                    <tr>
                        <td>Ближайшая дата</td>
                        <td>Категория</td>
                        <td>Название</td>
                        <td>Сумма</td>
                    </tr>
                    </thead>
                    <tbody>
                    {data && data.map((item, index) => (
                        <tr key={index} className={"h-12"}>
                            <td>{moment(item.createdAt).format('DD MMMM YYYY')}</td>
                            <td>{item.categoryName}</td>
                            <td>{item.title}</td>
                            <td>{item.etransaction==="INCOME" ? <p>+{item.amount}</p> : <p>-{item.amount}</p>}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
