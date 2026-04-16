import { SignUpForm } from "./ui/SignUpForm";

export default function NewAccount() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className="text-4xl mb-5">Nueva cuenta</h1>

      <SignUpForm />
    </div>
  );
};
