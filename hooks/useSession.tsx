import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/utils/supabase/init";
import { useRouter } from "next/router";

interface User {
	id?: string;
	name?: string;
	email?: string;
	picture?: string;
}

type SessionType = {
	user: User;
	signInWithGoogle: () => void;
	signOut: () => void;
	error: string | null;
	status: string;
};

const getURL = () => {
	const site_url =
		process?.env?.VERCEL_ENV === "preview"
			? process?.env?.NEXT_PUBLIC_PREVIEW_SITE_URL
			: process?.env?.NEXT_PUBLIC_SITE_URL;
	let url =
		site_url ?? // Set this to your site URL in production env.
		"http://localhost:3000/";
	// Make sure to include `https://` when not localhost.
	url = url.startsWith("http") ? url : `https://${url}`;
	// Make sure to include a trailing `/`.
	url = url.endsWith("/") ? url : `${url}/`;
	return url;
};

const signInWithGoogle = () => {
	supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "https://do-note.vercel.app/",
		},
	});
};

const signOut = () => {
	supabase.auth.signOut();
};

const defaultSession = {
	user: {
		id: "",
		name: "",
		email: "",
		picture: "",
	},
	signInWithGoogle,
	signOut,
	error: null,
	status: "loading",
};

const SessionContext = createContext<SessionType>(defaultSession);

export function SessionProvider({ children }: { children: ReactNode }) {
	// const [session, setSession] = useState<SessionType>(defaultSession);
	const [status, setStatus] = useState("loading");
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		email: "",
		picture: "",
	});

	const router = useRouter();
	// biome-ignore lint/correctness/useExhaustiveDependencies: need it to run once the component is mounted
	useEffect(() => {
		const setUserData = (userData: User | void) => {
			setUser({
				id: userData?.id ?? "",
				name: userData?.name ?? "",
				email: userData?.email ?? "",
				picture: userData?.picture ?? "",
			});
		};
		const getCurrentSession = async () => {
			setStatus("loading");
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				if (session?.user) {
					setStatus("authenticated");
					setUserData({
						id: session?.user.id,
						name: session?.user.user_metadata.name,
						email: session?.user.email,
						picture: session?.user.user_metadata.picture,
					});
				} else {
					setStatus("unauthenticated");
					setUserData();
					if (error) {
						// # todo: add some instruction here
					}
					router.push("/auth");
				}
			} catch (error) {
				setStatus("unauthenticated");
				// might wanna logout user
				router.push("/auth");
			}
		};

		getCurrentSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, newSession) => {
				switch (event) {
					case "SIGNED_IN":
						setUser({
							id: newSession?.user.id,
							name: newSession?.user.user_metadata.name,
							email: newSession?.user.email,
							picture: newSession?.user.user_metadata.picture,
						});
						break;
					case "SIGNED_OUT":
						setStatus("unauthenticated");
						router.push("/auth");
						break;
					default:
						break;
				}
			},
		);
		return () => {
			authListener.subscription.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SessionContext.Provider value={{ ...defaultSession, status, user }}>
			{children}
		</SessionContext.Provider>
	);
}

export const useSession = () => {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error("useSession hook must be used within SessionProvider");
	}

	return context;
};
