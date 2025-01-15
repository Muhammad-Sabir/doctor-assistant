import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function UserProfileMenu({ userImageUrl }) {

  return (
    <div className="hidden sm:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Link to={"profile"}>
            <Button
              variant="outline"
              size="smallIcon"
              className="p-0 mt-1 overflow-hidden border-none rounded-full bg-primary"
              aria-label="User profile menu"
            >
              <img
                src={userImageUrl}
                alt="user-image"
                className="object-cover w-8 h-8 rounded-full"
              />
            </Button>
          </Link>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
}
