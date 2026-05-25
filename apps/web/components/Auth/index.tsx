import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { useSession } from "@/hooks/useSession";
import { Button, Stack, Title, Text } from "@mantine/core";

const Auth = () => {
	const { status, signInWithGoogle } = useSession();
	const handleGoogleSignup = async () => {
		toast.loading("Signing you in...");
		signInWithGoogle();
	};
	useEffect(() => {
		if (status === "authenticated") {
			toast.success("Logged in, redirecting to home...", { id: "loggedin" });
		}
	}, [status]);
	const authLoading = status === "loading" || status === "authenticated";
	return (
		<Stack
			component="section"
			h="100vh"
			w="100%"
			align="center"
			justify="center"
			gap="xl"
			px="md"
		>
			<Stack align="center" gap="xs" style={{ textAlign: "center", letterSpacing: "0.04em" }}>
				<Title
					order={1}
					style={{
						fontFamily: '"Josefin Sans", sans-serif',
						fontSize: "clamp(3.5rem, 8vw, 7.75rem)",
						lineHeight: 1.1,
						fontWeight: 400,
					}}
				>
					Do Note
				</Title>
				<Text
					size="lg"
					c="dimmed"
					style={{
						fontSize: "clamp(1rem, 2vw, 1.25rem)",
						maxWidth: "500px",
					}}
				>
					A lightweight note taking app for your hyper productive self.
				</Text>
			</Stack>

			<Button
				size="lg"
				radius="xl"
				variant="default"
				disabled={authLoading}
				onClick={handleGoogleSignup}
				leftSection={!authLoading && <FcGoogle size={20} />}
				loading={authLoading}
				style={{
					height: "3.5rem",
					paddingLeft: "2rem",
					paddingRight: "2rem",
					fontSize: "1.1rem",
					letterSpacing: "1px",
					transition: "box-shadow 0.2s ease",
				}}
			>
				{authLoading ? "Checking login status..." : "Continue with Google"}
			</Button>
		</Stack>
	);
};

export default Auth;
