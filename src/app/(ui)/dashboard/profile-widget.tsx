import UserAvatar from "./user-avatar";

export default function ProfileWidget() {
  return (
    <div className="rounded-2xl m-4">
      <div className="flex align-center">
        {/* Avatar icon */}
        <UserAvatar />
      </div>
    </div>
  );
}