import RegisterAtendente from "../RegisterAtendente";

export default function RegisterAtendenteExample() {
  return (
    <div className="p-8">
      <RegisterAtendente
        onBack={() => console.log("Back clicked")}
        onRegister={(data) => console.log("Register:", data)}
      />
    </div>
  );
}
