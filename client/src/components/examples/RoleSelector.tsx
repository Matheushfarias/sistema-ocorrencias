import RoleSelector from "../RoleSelector";

export default function RoleSelectorExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <RoleSelector onSelectRole={(role) => console.log("Selected role:", role)} />
    </div>
  );
}
