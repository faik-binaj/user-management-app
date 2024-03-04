import "./Modal.css";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";

export interface ModalProps {
  title: string;
  closeModal: (value: string) => void;
  children: ReactNode;
}

export const Modal = ({ title, closeModal, children }: ModalProps) => {
  return createPortal(
    <div
      className="modal-container"
      onClick={(e) => {
        if ((e.target as Element).className === "modal-container")
          closeModal("Modal was closed");
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h1>{title}</h1>
          <IoClose onClick={() => closeModal("Modal was closed")} />
        </div>

        <div
          style={{
            borderBottom: "1px solid #E7EAF3",
          }}
        />

        <div className="modal-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
