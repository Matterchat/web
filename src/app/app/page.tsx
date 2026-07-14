import { AppShell } from "@/components/shell/AppShell";
import { api } from "@/lib/api";

export default async function Page() {
  const res = await api.get("/health");

  console.log(res.data);

  return (
    <AppShell>
      <p>Home</p>
    </AppShell>
  );
}
