import "./App.css";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  UsersProps,
} from "./redux/services/users-api.ts";
import { FaPlus } from "react-icons/fa";
import Button from "./components/Button/button.tsx";
import UsersTable from "./components/UsersTable/users-table.tsx";
import { useEffect, useState } from "react";
import AddUserModal, {
  Inputs,
} from "./components/Modal/add-user-modal.component.tsx";
import {
  ErrorNotifications,
  SuccessNotifications,
} from "./components/common/notifications.component.tsx";

function App() {
  const [usersData, setUsersData] = useState<UsersProps[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsersProps | null>(null);
  const [deleteUser] = useDeleteUserMutation();
  const { data, isFetching } = useGetAllUsersQuery();

  useEffect(() => {
    if (data && !isFetching) {
      setUsersData(data);
    }
  }, [data, isFetching]);

  const handleOnDelete = (id: number) => {
    const users = usersData?.filter((user) => user.id !== id);
    setUsersData(users as UsersProps[]);

    deleteUser({
      id: id,
    })
      .unwrap()
      .then(() => SuccessNotifications("User deleted successfully!"))
      .catch(() => ErrorNotifications("An error occurred!"));
  };

  const handleUserCreation = (data: Inputs) => {
    const latestIndex = (usersData && usersData[usersData?.length - 1]) || 0;

    if (data) {
      const newUser: UsersProps = {
        id: latestIndex && latestIndex?.id + 1,
        name: data.fullName,
        username: data.userName,
        email: data.email,
        address: {
          street: data.address,
          city: data.city,
          zipcode: data.zipCode,
          geo: {
            lat: data.latitude || "",
            lng: data.longitude || "",
          },
        },
        phone: String(data.phoneNumber),
      };

      if (data?.id) {
        const users = usersData?.filter((user) => user.id !== data.id);
        setUsersData([...(users as UsersProps[]), { ...newUser }]);
      } else {
        setUsersData((prevState) => [...(prevState as UsersProps[]), newUser]);
      }
    }
  };

  return (
    <div className="App">
      <div className="header">
        <Button onClick={() => setModalOpen(true)}>
          <FaPlus />
          Create New User
        </Button>
      </div>

      {modalOpen && (
        <AddUserModal
          selectedUser={selectedUser}
          setModalOpen={setModalOpen}
          setSelectedUser={setSelectedUser}
          handleUserCreation={handleUserCreation}
        />
      )}

      {isFetching ? (
        <h1>Loading....</h1>
      ) : (
        <UsersTable
          data={usersData || []}
          handleOnDelete={handleOnDelete}
          setSelectedUser={setSelectedUser}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
}

export default App;
