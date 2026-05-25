import { getCurrentMember, getMemberDisplayName } from "@/lib/wix/members";

import { NavActions } from "./nav-actions";

export async function NavbarAuthActions() {
	const member = await getCurrentMember();
	const displayName = member ? getMemberDisplayName(member) : null;

	return <NavActions displayName={displayName} isLoggedIn={Boolean(member)} />;
}
