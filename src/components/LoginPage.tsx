import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Flame } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
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

        {/* Login Form */}
        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
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