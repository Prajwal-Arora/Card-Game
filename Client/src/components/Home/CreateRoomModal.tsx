import React, { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { getLocalStore, setLocalStore } from "../../common/localStorage";
import { useBattleDetail, useSocketDetail } from "../../store/hooks";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { socketCreateIntegration } from "../../utils/contractIntegration/socketIntegration";

const CreateRoomModal = ({ account, show, handleClose, elementRef }: any) => {
  const dispatch = useAppDispatch();
  let history = useHistory();
  const battleArray = useBattleDetail();
  const [amount, setAmount] = useState("");
  const [teamSelect, setTeamSelect] = useState("");
  const socket = useSocketDetail();

  const handleRedirect = useCallback(() => {
    history.push({
      pathname: "/risk-factor",
      search: account,
      state: account,
    });
  }, [history]);

  const handleCreateRoom = () => {
    socketCreateIntegration(dispatch, {
      account,
      amount,
      teamSelect,
      onCreation: handleRedirect,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className="modal-bg ">
        <div>
          <h3 className="text-lg text-white gradient-text">xVemp Amount</h3>
          <div className="relative  flex-auto">
            <input
              type="number"
              placeholder="Enter amount"
              className={`w-100 px-2 py-2 input-bg text-primary`}
              id="input"
              onChange={(e) => setAmount(e.currentTarget.value)}
            />
            <div>
              <select
                onClick={(e) => setTeamSelect(e.currentTarget.value)}
                className="dropdown-btn mt-3 w-100 px-2 py-2"
              >
                <option value="">Select Team</option>
                <option value="Remus">Remus</option>
                <option value="Romulus">Romulus</option>
              </select>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={amount === "" || teamSelect === ""}
              className="mx-auto mt-4 custom-btn d-flex align-items-center"
            >
              <div className="d-flex align-items-center position-relative">
                <div>Create Room</div>
                <div className="position-absolute right-arrow-position">
                  <img src="/images/right-arrow.png" alt="" className="w-50" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateRoomModal;
