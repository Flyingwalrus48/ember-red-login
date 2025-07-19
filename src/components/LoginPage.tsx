import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      console.log("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary mr-2" />
              <Flame className="h-6 w-6 text-primary absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            FireForce Training
          </h1>
          <p className="text-muted-foreground">
            Professional firefighter training platform
          </p>
        </div>

        {/* Auth Tabs */}
        <Card className="p-8 bg-card border-border">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  variant="emergency"
                  size="lg"
                  className="w-full"
                >
                  Sign In
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  variant="emergency"
                  size="lg"
                  className="w-full"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2024 FireForce Training. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;