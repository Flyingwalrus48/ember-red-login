import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Flame, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Loading and error states
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignInLoading(true);
    setSignInError("");
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setSignInError("Invalid email or password. Please check your credentials and try again.");
    } finally {
      setIsSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignUpLoading(true);
    setSignUpError("");
    
    if (signupPassword !== confirmPassword) {
      setSignUpError("Passwords don't match. Please try again.");
      setIsSignUpLoading(false);
      return;
    }
    
    if (signupPassword.length < 6) {
      setSignUpError("Password must be at least 6 characters long.");
      setIsSignUpLoading(false);
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
      setResetMessage("Account created! Please check your email to verify your account.");
    } catch (error) {
      setSignUpError("Unable to create account. Please try again or contact support.");
    } finally {
      setIsSignUpLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email address first.");
      return;
    }
    
    setIsResetLoading(true);
    setResetMessage("");
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      setResetMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setResetMessage("Unable to send reset email. Please try again.");
    } finally {
      setIsResetLoading(false);
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setResetEmail(e.target.value);
                      if (signInError) setSignInError("");
                    }}
                    required
                    disabled={isSignInLoading}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (signInError) setSignInError("");
                    }}
                    required
                    disabled={isSignInLoading}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                {signInError && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="emergency"
                  size="lg"
                  className="w-full"
                  disabled={isSignInLoading}
                >
                  {isSignInLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isResetLoading}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {isResetLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                        Sending...
                      </>
                    ) : (
                      "Forgot Password?"
                    )}
                  </button>
                </div>

                {resetMessage && (
                  <div className="text-center text-sm text-primary bg-primary/10 p-3 rounded-md border border-primary/20">
                    {resetMessage}
                  </div>
                )}
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
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (signUpError) setSignUpError("");
                      if (resetMessage) setResetMessage("");
                    }}
                    required
                    disabled={isSignUpLoading}
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
                    placeholder="Create a password (min. 6 characters)"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (signUpError) setSignUpError("");
                      if (resetMessage) setResetMessage("");
                    }}
                    required
                    disabled={isSignUpLoading}
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
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (signUpError) setSignUpError("");
                      if (resetMessage) setResetMessage("");
                    }}
                    required
                    disabled={isSignUpLoading}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                {signUpError && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {resetMessage && (
                  <div className="text-center text-sm text-primary bg-primary/10 p-3 rounded-md border border-primary/20">
                    {resetMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="emergency"
                  size="lg"
                  className="w-full"
                  disabled={isSignUpLoading}
                >
                  {isSignUpLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
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