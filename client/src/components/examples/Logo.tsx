import Logo from "../Logo";

export default function LogoExample() {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <Logo size="lg" showTagline={true} />
      <Logo size="md" showTagline={true} />
      <Logo size="sm" showTagline={false} />
    </div>
  );
}
