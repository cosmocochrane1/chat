"use client";

export default function UserItem({user}: {user: any}) {
  return (
    <div className="flex items-center justify-between gap-2 border rounded-[8px] p-2">
    <div className="avatar rounded-full h-12 w-12 min-h-10 min-w-10 bg-emerald-500 text-white font-[700] flex items-center justify-center">
      <p className="uppercase">{user.email[0]}</p>
    </div>
    <div className="grow">
      <p className="text-[12px] text-neutral-500">{user.email}</p>
    </div>
  </div>
  );
} 
