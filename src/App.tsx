import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CanceledError } from "./services/api-client";
import userService, { User } from "./services/userService";
import useUsers from "./hooks/useUsers";

function App() {
  const { users, error, isLoading, setUsers, setError } = useUsers();
  const [updatedName, setUpdatedName] = useState("");

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));
    const request = userService.delete(user.id);
    request.catch((e) => {
      setError(e.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const newUser: User = { id: 0, name: "Raj" };
    const originalUser = [...users];
    setUsers([...users, newUser]);
    const request = userService.create<User>(newUser);
    request
      .then((res) => setUsers([res.data, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUser);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser: User = { ...user, name: updatedName };

    setUsers(users.map((u) => (u === user ? updatedUser : u)));
    userService.update(updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  return (
    <div>
      {isLoading && <div className="spinner-border" />}
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-primary mb-3" onClick={addUser}>
        Add
      </button>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between"
          >
            {user.name}
            <div>
              <input
                className="input form-control"
                key={user.id}
                type="text"
                // value={updatedName}
                placeholder="Updated Name"
                onChange={(e) => setUpdatedName(e.target.value)}
              ></input>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger mx-1"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
