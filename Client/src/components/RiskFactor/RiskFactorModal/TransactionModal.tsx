import React, { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { getLocalStore, setLocalStore } from "../../../common/localStorage";
import { useBattleDetail, useSocketDetail } from "../../../store/hooks";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { socketCreateIntegration } from "../../../utils/contractIntegration/socketIntegration";

const TransactionModal = ({ transactionStatus,show, handleClose,account }: any) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };


  return (
    <Modal show={show||transactionStatus} onHide={handleClose}>
      <Modal.Body className="modal-bg ">
        <div style={{ textAlign: "center" }}>
         {transactionStatus&&
         ( 
         <p
            style={{ fontSize: "24px", margin: "0px" }}
            className="text-lg text-white gradient-text ml-6"
          >
            Waiting for other player to complete transaction
          </p>)}
          {show&&(
            <p
            style={{ fontSize: "24px", margin: "0px" }}
            className="text-lg text-white gradient-text ml-6"
          >
            Transaction is under Progress
          </p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
