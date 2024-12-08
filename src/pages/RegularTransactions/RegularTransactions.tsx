import {useEffect, useState} from 'react';
import moment from 'moment';
import {useParams} from "react-router-dom";
interface DataType {
    id: number;
    createdAt: string;
    categoryName: string;
    title: string | null;
    amount: number;
    type: string;
    nextOccurrence: string
}

export const RegularTransactions = (user: any) => {
    const [data, setData] = useState<DataType[]>([])
    const {type} = useParams()

    useEffect(() => {
        console.log(data)
        console.log(user)
    })

    useEffect(() => {
        (async function() {
            try {

                const response = await fetch(`http://195.133.197.53:8080/regular_transaction/getAll/${user.user.id}`, {
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

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("authTokenCashFlow")
            const response = await fetch(`http://195.133.197.53:8080/regular_transaction/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            })

            if (response.ok) {
                setData((prevData) => prevData.filter(item => item.id !== id));
            } else {
                alert("Ошибка, попробуйте еще раз")
            }
        } catch (e) {
            console.log(e)
        }
    }

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
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {data && data.filter((item) => item.type === type?.toUpperCase()).map((item, index) => (
                        <tr key={index} className={"h-12"}>
                            <td>{moment(item.nextOccurrence).format('DD.MM.YYYY')}</td>
                            <td>{item.categoryName}</td>
                            <td>{item.title}</td>
                            <td>{item.type==="INCOME" ? <p>+{item.amount}</p> : <p>-{item.amount}</p>}</td>
                            <td><button onClick={() => handleDelete(item.id)}>Удалить</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
