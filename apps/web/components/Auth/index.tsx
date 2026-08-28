import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "@/hooks/useSession";
import { Button, Stack, Title, Text, TextInput, PasswordInput } from "@mantine/core";
import { useRouter } from "next/router";

const Auth = () => {
  const { status, login, register } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      toast.success("Logged in, redirecting...", { id: "loggedin" });
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch {
      toast.error(isLogin ? "Login failed" : "Registration failed", {
        id: "auth-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const authLoading = status === "loading" || status === "authenticated";

  return (
    <Stack component="section" h="100vh" w="100%" align="center" justify="center" gap="xl" px="md">
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

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360 }}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            disabled={authLoading}
          />
          <PasswordInput
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            minLength={8}
            disabled={authLoading}
          />
          <Button
            type="submit"
            size="lg"
            radius="xl"
            fullWidth
            loading={loading}
            disabled={authLoading}
          >
            {authLoading ? "Checking login status..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setIsLogin(!isLogin)}
            disabled={authLoading}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default Auth;
