import { Spinner } from "../ui/spinner";

export function LoadingSplash() {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-99999 flex flex-col items-center justify-center gap-4">
      <Spinner className="size-8" />
      <p className="text-xl opacity-65">Loading...</p>
    </div>
  );
}
