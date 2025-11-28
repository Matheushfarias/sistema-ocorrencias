import RegisterCidadao from "../RegisterCidadao";

export default function RegisterCidadaoExample() {
  return (
    <div className="p-8">
      <RegisterCidadao
        onBack={() => console.log("Back clicked")}
        onRegister={(data) => console.log("Register:", data)}
      />
    </div>
  );
}
