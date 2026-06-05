import { getCurrentMember, getMemberDisplayName } from "@/lib/wix/members";
import { wixClient } from "@/lib/wix/wix-client";

import { NavActions } from "./nav-actions";

export async function NavbarAuthActions() {
	const member = await getCurrentMember();
	const displayName = member ? getMemberDisplayName(member) : null;

	const isLoggedIn = wixClient.auth?.loggedIn();

	return <NavActions displayName={displayName} isLoggedIn={isLoggedIn} />;
}
