import {BlueButton} from '../../components/BlueButton/BlueButton.tsx';
import {useEffect, useState} from 'react';
import "./ReportPage.css"
import DatePicker from 'react-datepicker';
import moment from 'moment';
interface DataType {
    createdAt: string;
    categoryName: string;
    title: string | null;
    amount: number;
    etransaction: string
}

export const ReportPage = (user: any) => {
    const [data, setData] = useState<DataType[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);


    useEffect(() => {
        console.log(data)
        console.log(user)
        console.log(startDate)
        console.log(endDate)
    })

    // useEffect(() => {
    //     (async function() {
    //         try {
    //             const response = await fetch("", {
    //                 method: "GET",
    //                 credentials: "include",
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //             })
    //             if (!response.ok) {
    //                 throw new Error(`Error: ${response.status} ${response.statusText}`);
    //             }
    //
    //             const result = await response.json();
    //             setData(result);
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }())
    // }, [])

    const handleDateChange = (update: any) => {
        if (update[0] && !update[1]) {
            setStartDate(update[0]);
        } else if (update[0] && update[1]) {
            setStartDate(update[0]);
            setEndDate(update[1]);
        }
    };

    const handleFetchData = async () => {
        const sendData = {
            userId: 1,
            //@ts-ignore
            startDate: startDate && (new Date(startDate)).toISOString(),
            //@ts-ignore
            endDate: endDate && (new Date(endDate)).toISOString(),
        }

        console.log(sendData)
        // console.log((new Date(startDate)).toISOString())
        setData(
            [
                {
                    "categoryName": "Инвестиции",
                    "title": null,
                    "amount": 2500,
                    "createdAt": "2024-11-18T15:08:09.486859Z",
                    "etransaction": "INCOME"
                },
                {
                    "categoryName": "Моя работа",
                    "title": null,
                    "amount": 50000,
                    "createdAt": "2024-11-18T15:08:20.940319Z",
                    "etransaction": "INCOME"
                }
            ]

        )
        try {
            const result = await fetch('http://195.133.197.53:8889/statistic/transactions', {
                method: "POST",
                body: JSON.stringify(sendData),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            console.log(result)


        } catch (e) {
            console.log(e)
        }
    }

    const handleSendReport = async () => {
        try {
            const result = await fetch('', {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            if (result.ok) {
                window.alert("Отчет отправлен")
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
                <h1 className={'text-3xl'}>Отчёт</h1>
                <div className="date-picker-container">
                    <DatePicker
                        selectsRange
                        startDate={startDate || undefined}
                        endDate={endDate || undefined}
                        onChange={handleDateChange}
                        isClearable={true}
                        inline
                        // locale={ru}
                        dayClassName={(date) => {
                            if (date.toDateString() === new Date().toDateString()) {
                                return "today-highlight";
                            }
                            if (startDate && endDate) {
                                if (date.toDateString() === startDate.toDateString()) {
                                    return "range-start";
                                }
                                if (date.toDateString() === endDate.toDateString()) {
                                    return "range-end";
                                }
                                if (date >= startDate && date <= endDate) {
                                    return "range-highlight";
                                }
                            }
                            return "";
                        }}
                    />
                </div>
                <div className={"w-full flex justify-center"}>
                    <BlueButton text={"Запросить данные"} classname={"p-3 " + ((!startDate || !endDate) && "disabled hover:bg-blue-300 bg-blue-300 cursor-not-allowed" ) } onClick={handleFetchData}/>
                </div>
                <div className={"w-full flex justify-center"}>
                    <BlueButton text={"Сброс"} classname={"p-3"} onClick={() => {
                        setStartDate(null);
                        setEndDate(null)
                    }}/>
                </div>
                <table className={"w-[60vw] rounded-t-xl overflow-hidden"}>
                    <thead className={"bg-gray-300 h-12 font-bold"}>
                        <tr>
                            <td>Дата</td>
                            <td>Категория</td>
                            <td>Описание</td>
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
                <div className={"w-full flex flex-row-reverse"}>
                    <BlueButton classname={"rounded-2xl px-16 py-1"} text={"Отправить в телеграм"} onClick={handleSendReport}/>
                </div>
            </div>
        </div>
    )
}
