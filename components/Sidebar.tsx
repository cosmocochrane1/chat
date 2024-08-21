"use client";
import { useRouter } from "next/navigation";

import {
  BellIcon,
  Cookie,
  CreditCard,
  Inbox,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import UserItem from "./UserItem";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Sidebar({ user }: any) {
  const router = useRouter();

  const signOut = async () => {
    const response = await fetch("/auth/sign-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/login", { scroll: false });
    }
  };

  const menuList = [
    {
      group: "General",
      items: [
        {
          link: "/doctors",
          icon: <User />,
          text: "Doctors",
        },
        {
          link: "/doctors/new",
          icon: <Inbox />,
          text: "New Doctor",
        },
        {
          link: "/",
          icon: <BellIcon />,
          text: "Chat",
        },
      ],
    },
    {
      group: "Settings",
      items: [
        {
          link: "/",
          icon: <Settings />,
          text: "General Settings",
        },
        // {
        //   link: "/",
        //   icon: <Cookie />,
        //   text: "Privacy",
        // },
        {
          link: "/",
          icon: <MessageSquare />,
          text: "Logs",
        },
      ],
    },
  ];

  return (
    <div className="fixed flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4">
      <div>
        <UserItem user={user} />
      </div>
      <div className="grow">
        <div style={{ overflow: "visible" }}>
          <div style={{ overflow: "visible" }}>
            {menuList.map((menu: any, key: number) => (
              <ul key={key}>
                {menu.items.map((option: any, optionKey: number) => (
                  <Link href={option.link}>
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        console.log("shit");
                      }}
                      key={optionKey}
                      className="flex justify-start w-full gap-2 cursor-pointer"
                    >
                      {option.icon}
                      {option.text}
                    </Button>
                  </Link>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
}
