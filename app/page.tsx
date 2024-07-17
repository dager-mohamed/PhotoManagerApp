import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth()
  console.log(session)
  if(session?.user?.id) redirect('/dashboard')
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signIn("google", {redirectTo:"/dashboard"});
          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Chrome className="h-5 w-5" />
            Login with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
