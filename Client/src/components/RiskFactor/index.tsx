import React from 'react'
import { Card } from 'react-bootstrap'
import { setRiskFactor } from '../../store/reducer/userReducer'
import { useDispatch } from 'react-redux'
import './index.css'
import { useUserDetail } from '../../store/hooks'

const RiskFactor = () => {
    const dispatch = useDispatch()
    const predefinedValues = [
        { label: '10%', value: 10 },
        { label: '25%', value: 25 },
        { label: '50%', value: 50 }
    ]

    const handleRiskFactor=(value: number)=>{
        dispatch(setRiskFactor(value.toString()))
    }

    const userDetail= useUserDetail()

    return (
        <div className="w-75 m-auto pt-5">
            <div className="position-relative d-flex z-0">
                <img style={{ width: '30%' }} className="m-auto " src="/images/Rectangle 4.png" alt="" />
                <div style={{ top: '5px', fontSize: '24px' }} className="gradient-text position-absolute w-100 text-white text-center">
                    Risk Factor
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-4 h5 text-uppercase">
                <div className="gradient-text"> Select Risk Factor</div>


                <div className="d-flex px-1">
                    {predefinedValues.map(({ label, value: predefinedValue }) => {
                        return (
                            <div  className="content px-2" key={predefinedValue}>
                                <button onClick={() => handleRiskFactor(predefinedValue)} className="factor-label">{label}</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="d-flex w-75 m-auto">
                <div className="mt-4 mx-4 risk-bg w-50">
                    <Card >
                        <Card.Body>
                            <Card.Title className="gradient-text">Player 1</Card.Title>
                            <Card.Text>
                                <div className="d-flex align-items-center mt-4">
                                    <div className="gradient-text text-Shadow " >
                                        Risk Factor Selected
                                    </div>
                                    <div className="mx-4">
                                        <button className="factor-label">
                                           {userDetail?.riskFactor}%
                                        </button>
                                    </div>

                                </div>


                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="mt-4 risk-bg w-50">
                    <Card className="h-100">
                        <Card.Body className="d-flex justify-content-center align-items-center">
                            <div className="gradient-text text-Shadow">
                                Waiting For Opponent
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="text-center gradient-text mt-4">
                Please choose same risk factor to start the game.
            </div>
        </div>
    )
}

export default RiskFactor
