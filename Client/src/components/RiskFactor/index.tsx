import React from 'react'
import { Card } from 'react-bootstrap'
import './index.css'

const RiskFactor = () => {

    const predefinedValues = [
        { label: '10%', value: 10 },
        { label: '25%', value: 25 },
        { label: '50%', value: 50 }
    ]

    return (
        <div className="w-75 m-auto pt-5">
            <div className="position-relative d-flex z-0">
                <img style={{ width: '35%' }} className="m-auto " src="/images/Rectangle 4.png" alt="" />
                <div style={{ top: '8px', fontSize: '24px' }} className="gradient-text position-absolute w-100 text-white text-center">
                    Risk Factor
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-4 h5 text-uppercase">
                <div className="gradient-text"> Select Risk Factor</div>


                <div className="d-flex px-1">
                    {predefinedValues.map(({ label, value: predefinedValue }) => {
                        return (
                            <div className="content px-2" key={predefinedValue}>
                                <button className="factor-label">{label}</button>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="mt-4">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>

            </div>
        </div>
    )
}

export default RiskFactor
