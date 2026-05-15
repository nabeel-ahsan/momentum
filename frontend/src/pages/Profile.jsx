import { useAuth } from "../context/AuthProvider";

const Profile = () => {
    const {user, logout} = useAuth();
    return (
        <>
        <div>
        <label>Name:</label>
        <p>{user.name}</p>
        </div>
        <div>
        <label>Email:</label>
        <p>{user.email}</p>
        </div>
        <button onClick={logout}>LogOut</button>
        </>
  ) 
}

export default Profile