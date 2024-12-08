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
    type: string
}

const periods = [
    {
        id: "TODAY",
        name: "За сегодня",
    },
    {
        id: "WEEK",
        name: "За неделю",
    },
    {
        id: "MONTH",
        name: "За месяц",
    },
    {
        id: "YEAR",
        name: "За год",
    },
    // {
    //     id: "EXIT",
    //     name: "Точные даты",
    // }
]

export const Transactions = (user: any) => {
    const [data, setData] = useState<DataType[]>([])
    const [diagram, setDiagram] = useState<string>()
    const [openCalendar, setOpenCalendar] = useState<boolean>(false)
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const [interval, setInterval] = useState<string>("YEAR")

    const { type} = useParams()

    useEffect(() => {
        console.log(data)
        console.log(user)
    })

    const handleWordClick = (period: string) => {
        setInterval(period);
        setOpenCalendar(false)
        // fetchByInterval().then(r => console.log(r))
    };

    useEffect(() => {
        (async function() {
            if (interval !== "EXIT") {
                try {
                    const token = localStorage.getItem("authTokenCashFlow")
                    const response = await fetch(`http://195.133.197.53:8080/api/statistics/transaction?userId=${user.user.id}&interval=${interval}&dateTime=${new Date(Date.now()).toISOString()}&type=${type?.toUpperCase()}`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${token}`
                        },
                        // body: JSON.stringify({userId: user.user.id, interval: "TODAY", dateTime: "2024-12-06T22:02:04.710Z", type: "INCOME"})
                    })
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }

                    const result = await response.json();
                    console.log(result)
                    setData(result.transactions);
                    if (type !== "all") {
                        const imageSrc = result.diagramPng.startsWith('data:image/')
                            ? result.diagramPng
                            : `data:image/png;base64,${result.diagramPng}`;
                        setDiagram(imageSrc);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }())
    }, [type, interval])

    useEffect(() => {
        setInterval("YEAR");
        setOpenCalendar(false)
    }, [type]);

    const handleOpenCalendar = () => {
        setOpenCalendar(true)
        setInterval("EXIT")
    }

    const handleDateChange = (update: any) => {
        console.log(update)
        if (update[0] && !update[1]) {
            setFromDate(update[0]);
        } else if (update[0] && update[1]) {
            setFromDate(update[0]);
            setToDate(update[1]);
        }
    };

    function toLocalISOString(date: any) {
        const offsetMs = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() - offsetMs);
        return localTime.toISOString();
    }

    const handleFetchData = async () => {
        const sendData = {
            userId: user.user.id,
            //@ts-ignore
            fromDate: fromDate && toLocalISOString(new Date(fromDate)),
            //@ts-ignore
            toDate: toDate && toLocalISOString(new Date(toDate)),
        }

        console.log(sendData)
        // console.log((new Date(startDate)).toISOString())
        try {
            console.log(fromDate)
            const response = await fetch(`http://195.133.197.53:8080/api/statistics/transaction/custom?userId=${user.user.id}&interval=${interval}&startDate=${fromDate && toLocalISOString(new Date(fromDate))}&endDate=${toDate && toLocalISOString(new Date(toDate))}&type=${type?.toUpperCase()}`, {
                method: "GET",
                // body: JSON.stringify(sendData),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            if (response.ok) {
                const result = await response.json();
                console.log(result)
                setData(result.transactions);
                if (type !== "all") {
                    const imageSrc = result.diagramPng.startsWith('data:image/')
                        ? result.diagramPng
                        : `data:image/png;base64,${result.diagramPng}`;
                    setDiagram(imageSrc);
                }
            }

        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className={'max-w-screen-xl mx-auto'}>
            <div className={'flex flex-col gap-8 text-center w-full my-10'}>
                <h1 className={'text-3xl'}>{type === "income" ? <p>Доходы</p> : type === "all" ? <p>Общий обзор</p> : <p>Расходы</p>}</h1>
                <div className={"flex gap-3"}>
                    {periods.map((period) => (
                        <span
                            key={period.id}
                            onClick={() => handleWordClick(period.id)}
                            className={interval === period.id ? "bg-gray-400" : "bg-gray-300"}
                            style={{
                                padding: "5px 10px",
                                cursor: "pointer",
                                borderRadius: "12px",
                            }}
                        >{period.name}</span>
                    ))}
                    <span className={interval === "EXIT" ? "bg-gray-400" : "bg-gray-300"} style={{padding: "5px 10px", cursor: "pointer", borderRadius: "12px"}}
                    onClick={() => handleOpenCalendar()}>Точные даты</span>
                </div>

                {openCalendar &&
                    (<div className={"flex flex-col gap-2"}>
                        <div className="date-picker-container">
                            <DatePicker
                                selectsRange
                                startDate={fromDate || undefined}
                                endDate={toDate || undefined}
                                onChange={handleDateChange}
                                isClearable={true}
                                inline
                                // locale={ru}
                                dayClassName={(date) => {
                                    if (date.toDateString() === new Date().toDateString()) {
                                        return "today-highlight";
                                    }
                                    if (fromDate && toDate) {
                                        if (date.toDateString() === fromDate.toDateString()) {
                                            return "range-start";
                                        }
                                        if (date.toDateString() === toDate.toDateString()) {
                                            return "range-end";
                                        }
                                        if (date >= fromDate && date <= toDate) {
                                            return "range-highlight";
                                        }
                                    }
                                    return "";
                                }}
                            />
                        </div>
                        <div className={"w-full flex justify-center"}>
                            <BlueButton text={"Запросить данные"} classname={"p-3 " + ((!fromDate || !toDate) && "disabled hover:bg-blue-300 bg-blue-300 cursor-not-allowed" ) } onClick={handleFetchData}/>
                        </div>
                        <div className={"w-full flex justify-center"}>
                            <BlueButton text={"Сброс"} classname={"p-3"} onClick={() => {
                                setFromDate(null);
                                setToDate(null)
                            }}/>
                        </div>
                    </div>
                )}

                {diagram && type !== "all" && <img alt="avatar" src={diagram}/>}
                <table className={"w-[60vw] rounded-t-xl overflow-hidden"}>
                    <thead className={"bg-gray-300 h-12 font-bold"}>
                    <tr>
                        <td>Дата</td>
                        <td>Категория</td>
                        <td>Название</td>
                        <td>Сумма</td>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length > 0 && data.map((item, index) => (
                        <tr key={index} className={"h-12"}>
                            <td>{moment(item.createdAt).format('DD.MM.YYYY')}</td>
                            <td>{item.categoryName}</td>
                            <td>{item.title}</td>
                            <td>{item.type ==="INCOME" ? <p>+{item.amount}</p> : <p>-{item.amount}</p>}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
