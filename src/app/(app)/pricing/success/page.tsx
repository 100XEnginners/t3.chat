import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Success() {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect('/login');
  }
  const session_id = session.user.id;
  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
      <p>Session ID: {session_id}</p>
    </div>
  );
}