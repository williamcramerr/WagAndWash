"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Mail,
  Check,
  UserPlus,
} from "lucide-react";

interface TeamMember {
  id: string;
  email: string;
  role: "groomer" | "admin";
  status: "pending";
}

export default function OnboardingTeamPage() {
  const router = useRouter();
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [showInvite, setShowInvite] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"groomer" | "admin">("groomer");

  const addMember = () => {
    if (email && email.includes("@")) {
      setMembers((prev) => [
        ...prev,
        {
          id: `member-${Date.now()}`,
          email,
          role,
          status: "pending",
        },
      ]);
      setEmail("");
      setShowInvite(false);
    }
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Invite Your Team</CardTitle>
          </div>
          <CardDescription>
            Add team members who will help manage appointments and perform grooming.
            They&apos;ll receive an email invitation to join.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Members List */}
          <AnimatePresence mode="popLayout">
            {members.length > 0 && (
              <div className="space-y-3">
                {members.map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {member.role}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Invite pending
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(member.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {members.length === 0 && !showInvite && (
            <div className="text-center py-8 border rounded-lg border-dashed">
              <UserPlus className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">No team members yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Invite groomers and admins to help manage your business
              </p>
              <Button onClick={() => setShowInvite(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          )}

          {/* Invite Form */}
          <AnimatePresence>
            {showInvite && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 border rounded-lg bg-muted/30"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="groomer@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={role === "groomer" ? "default" : "outline"}
                        onClick={() => setRole("groomer")}
                        className="flex-1"
                      >
                        Groomer
                      </Button>
                      <Button
                        type="button"
                        variant={role === "admin" ? "default" : "outline"}
                        onClick={() => setRole("admin")}
                        className="flex-1"
                      >
                        Admin
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {role === "groomer"
                        ? "Groomers can view their schedule and mark appointments complete"
                        : "Admins can manage all aspects of the business"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowInvite(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addMember}>
                    <Check className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add More Button */}
          {members.length > 0 && !showInvite && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowInvite(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite Another Member
            </Button>
          )}

          {/* Skip option */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {members.length === 0
                ? "You can always invite team members later"
                : `${members.length} invitation${members.length > 1 ? "s" : ""} will be sent`}
            </p>
            <Button variant="ghost" size="sm" onClick={() => router.push("/onboarding/complete")}>
              Skip for now
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/hours")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => router.push("/onboarding/complete")}>
              {members.length > 0 ? "Send Invites & Finish" : "Finish Setup"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
