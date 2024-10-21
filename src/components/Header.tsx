import { SignedIn, UserButton } from "@clerk/nextjs";
import { FilePlus2} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between p-5 border-b bg-white shadow-sm">
      <Link href="/dashbaord">
        Chat to <span className="text-indigo-600" />
        PDF
      </Link>
      <SignedIn>
        <div className="flex items-center space-x-2">
          <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dahboard">My documents</Link>
          </Button>

          <Button asChild variant="outline" className="border-indigo-600">
            <Link href="/dashboard/upload">
              <FilePlus2 className="text-indigo-600"></FilePlus2>
            </Link>
          </Button>
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;
