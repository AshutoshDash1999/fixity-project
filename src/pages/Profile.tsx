import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  return (
    <div className="flex-column">
      <h1>Name: {location?.state?.userDetails?.name}</h1>
      <h2>Phone Number: {location?.state?.userDetails?.phoneNumber}</h2>

      <table>
        <tbody>
          <tr>
            <td>{location?.state?.userDetails?.country}</td>
            <td>{location?.state?.userDetails?.state}</td>
            <td>{location?.state?.userDetails?.city}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Profile;
