import { useUser } from "../context/UserContext";

export function Dashboard() {
  const { userAttributes, isLoading, error } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;
  if (!userAttributes) return <div>No user data available</div>;

  return (
    <div>
      <div className="user-details">
        <p>Name: {userAttributes.name}</p>
        <p>Email: {userAttributes.email}</p>
        <p>Role: {userAttributes["custom:userRole"]}</p>
      </div>
    </div>
  );
}
