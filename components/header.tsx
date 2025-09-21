"use client";

import Link from "next/link";
import {
  Film,
  Upload,
  UserCircle,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  Newspaper,
  Wand2,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context-mock";

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Button variant="ghost" className="justify-start" asChild onClick={onClick}>
    <Link href={href}>{children}</Link>
  </Button>
);

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setSheetOpen(false);
  };

  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block">Artisan Reels</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-2 justify-end">
          <Button variant="ghost" asChild>
            <Link href="/create">
              <Wand2 className="mr-2 h-4 w-4" />
              Create
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/test-db">
              <BarChart3 className="mr-2 h-4 w-4" />
              Test DB
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile/artisan-1">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-1 justify-end">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col space-y-2">
                <NavLink href="/create" onClick={closeSheet}>
                  <Wand2 className="mr-2" /> Create
                </NavLink>
                <NavLink href="/dashboard" onClick={closeSheet}>
                  <BarChart3 className="mr-2" /> Dashboard
                </NavLink>
                <NavLink href="/schedule" onClick={closeSheet}>
                  <Calendar className="mr-2" /> Schedule
                </NavLink>
                <NavLink href="/test-db" onClick={closeSheet}>
                  <BarChart3 className="mr-2" /> Test DB
                </NavLink>
                <NavLink href="/profile/artisan-1" onClick={closeSheet}>
                  <UserCircle className="mr-2" /> Profile
                </NavLink>
                {isLoading ? (
                  <div className="h-8 w-full animate-pulse bg-muted rounded" />
                ) : user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Welcome, {user.name}
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2" /> Log Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <NavLink href="/signin" onClick={closeSheet}>
                      <LogIn className="mr-2" /> Sign In
                    </NavLink>
                    <NavLink href="/signup" onClick={closeSheet}>
                      <UserPlus className="mr-2" /> Sign Up
                    </NavLink>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
