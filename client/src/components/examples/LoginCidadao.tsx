import LoginCidadao from "../LoginCidadao";

export default function LoginCidadaoExample() {
  return (
    <div className="p-8">
      <LoginCidadao
        onBack={() => console.log("Back clicked")}
        onLogin={(email, password) => console.log("Login:", email, password)}
        onRegister={() => console.log("Register clicked")}
      />
    </div>
  );
}
