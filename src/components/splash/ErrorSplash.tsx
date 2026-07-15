import { LucideXCircle } from "lucide-react";

export interface IErrorSplashProps {
  title: string;
  message: string;
}

// TODO: Add anonymous telemetry
export function ErrorSplash(props: IErrorSplashProps) {
  return (
    <div className="w-screen h-screen fixed z-100000 top-0 left-0 flex items-center justify-center flex-col gap-4 bg-background">
      <LucideXCircle className="size-32 text-red-400" />
      <h1 className="text-xl font-bold">{props.title}</h1>
      <p className="opacity-65">{props.message}</p>
    </div>
  );
}
