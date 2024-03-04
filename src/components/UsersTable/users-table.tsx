import "./table.css";
import { UsersProps } from "../../redux/services/users-api.ts";
import { MdModeEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

const UsersTable = ({
  data,
  handleOnDelete,
  setSelectedUser,
  setModalOpen,
}: {
  data: UsersProps[];
  handleOnDelete: (id: number) => void;
  setSelectedUser: (value: UsersProps) => void;
  setModalOpen: (value: boolean) => void;
}) => {
  return (
    <div className="container">
      <ul className="responsive-table">
        <li className="table-header">
          <div className="col col-1">ID</div>
          <div className="col col-2">Name</div>
          <div className="col col-3">Email</div>
          <div className="col col-4">Phone</div>
          <div className="col col-5">Actions</div>
        </li>

        {data.map((item) => (
          <li className="table-row" key={item.id}>
            <div className="col col-1" data-label="id">
              {item.id}
            </div>
            <div className="col col-2" data-label="name">
              {item.name}
            </div>
            <div className="col col-3" data-label="email">
              {item.email}
            </div>
            <div className="col col-4" data-label="phone">
              {item.phone}
            </div>
            <div className="col col-5" data-label="action">
              <MdModeEdit
                className="edit"
                onClick={() => {
                  setModalOpen(true);
                  setSelectedUser(item);
                }}
              />
              <FaRegTrashCan
                className="delete"
                onClick={() => handleOnDelete(item.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersTable;
