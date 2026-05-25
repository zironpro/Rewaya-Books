import { LoginCallbackHandler } from "@/features/account/components/login-callback-handler";
import { env } from "@/lib/env/server";

export default function LoginCallbackPage() {
	return <LoginCallbackHandler clientId={env.WIX_CLIENT_ID} />;
}
