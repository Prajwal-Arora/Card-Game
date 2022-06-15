import { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSocketDetail } from "../../../store/hooks";
import { useAppDispatch } from "../../../store/store";
import { socketCreateIntegration } from "../../../utils/contractIntegration/socketIntegration";

const CreateRoomModal = ({  account, show, handleClose, elementRef }: any) => {
  const dispatch = useAppDispatch();
  let socket: any = useSocketDetail();
  let history = useHistory();
  const [teamSelect, setTeamSelect] = useState("");

  useEffect(() => {
    setTeamSelect('')
  }, [show])


  const handleRedirect = useCallback(() => {
    history.push({
      pathname: "/ready",
      search: account,
      state: account,
    });
  }, [history]);

  const handleCreateRoom = () => {
    socketCreateIntegration(dispatch, {
      account,
      socket,
      teamSelect,
      onCreation: handleRedirect,
    });
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className="modal-bg ">
        <div>
          <div className="relative  flex-auto">
          <h3 className="text-lg text-white gradient-text">Select Team</h3>
            <div>
              <select
                onChange={(e) => setTeamSelect(e.currentTarget.value)}
                className={`form-select ${teamSelect !== '' && 'create-modal-btn'} dropdown-btn mt-3 w-100 px-2 py-2`}
              >
                <option className="bg-black text-white" value="">
                  Select Team
                </option>
                <option className="bg-black text-white " value="Remus">
                  Remus
                </option>
                <option className="bg-black text-white " value="Romulus">
                  Romulus
                </option>
              </select>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={
                teamSelect === ""
              }
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
