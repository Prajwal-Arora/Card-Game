import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useBattleDetail } from '../../../store/hooks';

const RomulusWinner = ({playerName,Round1Score,Round2Score,Round3Score}:any) => {
    const battleArray = useBattleDetail();
    return (
        <div className="remus-div">
            <div className="main-title-remus text-uppercase font-family">{playerName} WINS</div>
            <div className="win-details-remus">
              {" "}
              <Row>
                <Col></Col>
                <Col>REMUS</Col>
                <Col>ROMULUS</Col>
              </Row>
            </div>
            <div className="win-details-remus">
              <Row>
                <Col>ROUND ONE</Col>
                <Col>{battleArray.team1 === playerName ? Round1Score.p1 : Round1Score.p2}</Col>
                <Col>{battleArray.team1 === playerName ? Round1Score.p2 : Round1Score.p1}</Col>
              </Row>
            </div>
            {Object.keys(Round2Score).length !== 0 &&
              <div className="win-details-remus">
                {" "}
                <Row>
                  <Col>ROUND TWO</Col>
                  <Col>{battleArray.team1 === playerName ? Round2Score.p1 : Round2Score.p2}</Col>
                  <Col>{battleArray.team1 === playerName ? Round2Score.p2 : Round2Score.p1}</Col>
                </Row>
              </div>
            }
            {battleArray.winner_r1 !== battleArray.winner_r2 &&
              <div className="win-details-remus">
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

export default RomulusWinner
