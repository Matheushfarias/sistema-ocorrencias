import OccurrenceForm from "../OccurrenceForm";

export default function OccurrenceFormExample() {
  return (
    <OccurrenceForm
      onBack={() => console.log("Back clicked")}
      onSubmit={(data) => console.log("Submit:", data)}
    />
  );
}
