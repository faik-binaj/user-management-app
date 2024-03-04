import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputComponent from "../common/input.component.tsx";
import { Modal } from "./Modal.tsx";
import {
  useAddNewUserMutation,
  UsersProps,
  useUpdateUserMutation,
} from "../../redux/services/users-api.ts";
import {
  ErrorNotifications,
  SuccessNotifications,
} from "../common/notifications.component.tsx";
import "./user-modal.css";
import Button from "../Button/button.tsx";
import { ErrorMessage } from "@hookform/error-message";
import { Autocomplete } from "@react-google-maps/api";

export type Inputs = {
  id?: number;
  fullName: string;
  address: string;
  userName: string;
  city: string;
  email: string;
  zipCode: string;
  phoneNumber: number;
  latitude?: string;
  longitude?: string;
};

interface UserModalProps {
  selectedUser: UsersProps | null;
  setModalOpen: (value: boolean) => void;
  setSelectedUser: (value: UsersProps | null) => void;
  handleUserCreation: (value: Inputs) => void;
}

const AddUserModal = ({
  selectedUser,
  setModalOpen,
  setSelectedUser,
  handleUserCreation,
}: UserModalProps) => {
  const [useGeoLocation, setUseGeolocation] = useState<boolean>(false);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [origin, setOrigin] = useState<google.maps.places.PlaceResult>();

  const geoCity = origin?.vicinity;
  const location = origin?.geometry?.location;
  const latitude = location?.lat();
  const longitude = location?.lng();

  const [addNewUser] = useAddNewUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (selectedUser) {
      updateUser({
        id: selectedUser.id,
        body: data,
      })
        .unwrap()
        .then(() => {
          handleUserCreation({
            id: selectedUser.id,
            ...data,
          });
          SuccessNotifications("User updated successfully!");
        })
        .catch(() => ErrorNotifications("An error occurred!"));
    } else {
      addNewUser(data)
        .unwrap()
        .then(() => {
          handleUserCreation(data);
          SuccessNotifications("User created successfully!");
        })
        .catch(() => ErrorNotifications("An error occurred!"));
    }
    handleButtonClick();
  };

  const handleButtonClick = () => {
    setModalOpen(false);
    setSelectedUser(null);
    reset();
  };

  const handlePlaceSelect = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setOrigin(place);
    } else {
      console.log("Autocomplete is not yet available.");
    }
  };

  return (
    <Modal closeModal={handleButtonClick} title="New User Info">
      <div
        style={{
          paddingTop: "10px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-row">
            <InputComponent
              register={register("fullName", { required: "Name is required!" })}
              labelText="Full Name"
              value={selectedUser?.name}
              name="fullName"
              errors={errors}
            />

            <div className="address-column">
              <div className="address-row">
                <label>Address</label>
                <div className="checkbox-container">
                  <input
                    type={"checkbox"}
                    onChange={(event) =>
                      setUseGeolocation(event.target.checked)
                    }
                    className="checkbox"
                  />
                  <label className="checkbox-label">Use Geo Location</label>
                </div>
              </div>

              <Autocomplete
                onLoad={(auto) => setAutocomplete(auto)}
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  {...register("address", {
                    required: "Address is required!",
                  })}
                  defaultValue={selectedUser?.address.street}
                  className="address-input"
                  placeholder="Search for addresses..."
                />
              </Autocomplete>

              {errors && <ErrorMessage errors={errors} name="address" as="p" />}
            </div>
          </div>

          <div className="form-row">
            <InputComponent
              register={register("userName", {
                required: "Username is required!",
              })}
              labelText="UserName"
              value={selectedUser?.username}
              errors={errors}
              name="userName"
            />
            <InputComponent
              register={register("city", { required: "City is required!" })}
              labelText="City"
              value={geoCity || selectedUser?.address?.city}
              errors={errors}
              name="city"
            />
          </div>

          <div className="form-row">
            <InputComponent
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              labelText="Email"
              value={selectedUser?.email}
              errors={errors}
              name="email"
            />
            <InputComponent
              register={register("zipCode", {
                required: "Zip-code is required",
              })}
              labelText="Zip Code"
              value={selectedUser?.address?.zipcode}
              errors={errors}
              name="zipCode"
            />
          </div>

          <div className="form-row">
            <InputComponent
              register={register("phoneNumber", {
                required: "Phone number is requred!",
              })}
              labelText="Phone Nr"
              type="string"
              value={selectedUser?.phone}
              errors={errors}
              name="phoneNumber"
            />

            {useGeoLocation && (
              <div className="geo-location-inputs">
                <div>
                  <InputComponent
                    register={register("latitude")}
                    labelText="Latitude"
                    type="string"
                    value={latitude || selectedUser?.address?.geo?.lat}
                  />
                </div>
                <div>
                  <InputComponent
                    register={register("longitude")}
                    labelText="Longitude"
                    type="string"
                    value={longitude || selectedUser?.address?.geo?.lng}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddUserModal;
