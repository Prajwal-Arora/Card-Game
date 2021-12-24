import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useBattleDetail } from '../../../store/hooks';

const RemusWinner = ({playerName,Round1Score,Round2Score,Round3Score}:any) => {
    const battleArray = useBattleDetail();
    return (
        <div className="romulus-div">
            <div className="main-title font-family text-uppercase">{playerName} WINS</div>
            <div className="win-details">
              <Row>
                <Col></Col>
                <Col>ROMULUS</Col>
                <Col>REMUS</Col>
              </Row>
            </div>
            <div className="win-details">
              <Row>
                <Col>ROUND ONE</Col>
                <Col>{battleArray.team1 === playerName ? Round1Score.p1 : Round1Score.p2}</Col>
                <Col>{battleArray.team1 === playerName ? Round1Score.p2 : Round1Score.p1}</Col>
              </Row>
            </div>
            {Object.keys(Round2Score).length !== 0 &&
              <div className="win-details">
                {" "}
                <Row>
                  <Col>ROUND TWO</Col>
                  <Col>{battleArray.team1 === playerName ? Round2Score.p1 : Round2Score.p2}</Col>
                  <Col>{battleArray.team1 === playerName ? Round2Score.p2 : Round2Score.p1}</Col>
                </Row>
              </div>}
            {(battleArray.winner_r1 !== battleArray.winner_r2 && Object.keys(Round3Score).length !== 0) &&
              <div className="win-details">
                {" "}
                <Row>
                  <Col>ROUND THREE</Col>
                  <Col>{battleArray.team1 === playerName ? Round3Score.p1 : Round3Score.p2}</Col>
                  <Col>{battleArray.team1 === playerName ? Round3Score.p2 : Round3Score.p1}</Col>
                </Row>
              </div>}

          </div>
    )
}

export default RemusWinner
