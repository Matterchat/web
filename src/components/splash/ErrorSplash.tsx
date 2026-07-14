export interface IErrorSplashProps {
  title: string;
  message: string;
}

// TODO: Implement
export function ErrorSplash(props: IErrorSplashProps) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
    </div>
  );
}
