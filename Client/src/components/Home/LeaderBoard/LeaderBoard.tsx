import { findIndex } from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Spinner, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiHandler } from '../../../services/apiService/axios';
import { getLeaderBoard } from '../../../services/apiService/userServices';
import { addressSubstring } from '../../../utils/CommonUsedFunction';
import CustomTable from '../../common/CustomTable'
import '../index.css'

const LeaderBoard = () => {
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(true)
    const [tableStructure, setTableStructure] = React.useState<any>({
        columns: [],
        rows: []
    });

    const handleBack = () => {
        history.push("/");
    };

    useEffect(() => {
        apiHandler(() => getLeaderBoard(),
            {
                onSuccess: (response: any) => {
                    if (response) {
                        setIsLoading(false)
                        setTableStructure({
                            columns: [
                                {
                                    label: "Rank",
                                    render: (row: any) => {
                                        return <span>{response.findIndex((item: any) => item.user === row.user)+1}</span>;
                                    },
                                },
                                {
                                    label: "User Address",
                                    key: "user",
                                    render: (row: any) => {
                                        return <span>{addressSubstring(row.user)}</span>;
                                    },
                                },
                                {
                                    label: "Game Played",
                                    key: "played",
                                },
                                {
                                    label: "Total win",
                                    key: "wins",

                                },
                                {
                                    label: "Win %",
                                    render: (row: any) => {
                                        return <span>{((row?.wins / row?.played) * 100).toFixed(2)} %</span>;
                                    },

                                },
                            ],
                            rows: response
                        })
                    }
                },
                onError: (error: any) => {
                    console.log("error", error);
                },
            })

    }, [])

    return (
        <div>
            <div className="position-relative d-flex z-0 mb-3">
                <img
                    style={{ width: "25%" }}
                    className="m-auto "
                    src="/images/Rectangle 4.png"
                    alt=""
                />
                <div
                    style={{ fontSize: "2.2vw" }}
                    className="gradient-text position-absolute w-100 text-white text-center"
                >
                    Leaderboard
                </div>
            </div>

            <div className='history-table-wrapper header-table leader-header'>
                <Table responsive striped hover variant="dark" {...tableStructure}>
                    <thead>
                        <thead>
                            <tr>
                                <th>{"Rank"}</th>
                                <th>{"User Address"}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <th>{""}</th>
                                <div>
                                    <th>{"Played"}</th>
                                    <th>{"Win"}</th>
                                    <th>{""}</th>
                                    <th>{"Win %"}</th>
                                </div>
                            </tr>
                        </thead>
                    </thead>
                    <tbody>
                        {isLoading ?
                            (<div>
                                <Spinner animation="border" style={{ display: 'block', margin: '50px auto',position:'unset' }} />
                            </div>) :
                            (<div className="mt-4 v-scrolling-leaderboard ">
                                <CustomTable {...tableStructure} />
                            </div>)
                        }
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    <button onClick={handleBack} className="end-btn">
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeaderBoard
