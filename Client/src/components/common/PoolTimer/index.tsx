import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { memo } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import "./index.css";
import { round } from "lodash";

function PoolTimer({ time, response }: any) {
  return (
    <div className="countDownTimer">
      <CountdownCircleTimer
        size={45}
        strokeLinecap={"square"}
        strokeWidth={2}
        isPlaying
        duration={time}
        colors={"#ffd92c"}
        trailColor="red"
        onComplete={() => {
          response && response();
        }}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
}

export default memo(PoolTimer);
