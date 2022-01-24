import React, { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { getLocalStore, setLocalStore } from "../../../common/localStorage";
import { useBattleDetail, useSocketDetail } from "../../../store/hooks";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { socketCreateIntegration } from "../../../utils/contractIntegration/socketIntegration";

const TransactionModal = ({ show, handleClose,account }: any) => {
  const dispatch = useAppDispatch();
  let history = useHistory();
  const battleArray = useBattleDetail();
  const [amount, setAmount] = useState("");
  const socket = useSocketDetail();
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className="modal-bg ">
        <div style={{ textAlign: "center" }}>
          <p
            style={{ fontSize: "24px", margin: "0px" }}
            className="text-lg text-white gradient-text ml-6"
          >
            Transaction is under Progress
          </p>
          {/* <div className="relative  flex-auto">
            <button
              onClick={() => handleApprove()}
              disabled={loading}
              className="mx-auto mt-4 custom-btn d-flex align-items-center"
            >
              <div className="d-flex align-items-center position-relative">
                <div>Create Room</div>
                <div className="position-absolute right-arrow-position">
                  <img src="/images/right-arrow.png" alt="" className="w-50" />
                </div>
              </div>
            </button>
          </div> */}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
