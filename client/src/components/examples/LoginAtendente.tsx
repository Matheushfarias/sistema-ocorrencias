import LoginAtendente from "../LoginAtendente";

export default function LoginAtendenteExample() {
  return (
    <div className="p-8">
      <LoginAtendente
        onBack={() => console.log("Back clicked")}
        onLogin={(inst, mat, pwd) => console.log("Login:", inst, mat, pwd)}
        onRegister={() => console.log("Register clicked")}
      />
    </div>
  );
}
