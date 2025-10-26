import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar, Key, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {IUser} from "@/interfaces/auth/IUser";


export default function DashboardCards({user}: {user: Omit<IUser, 'password'>}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-transparent shadow-lg border-slate-500/20">
                <CardHeader className="flex items-center gap-2">
                    <User className="text-blue-500"/>
                    <CardTitle>User Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p><span className="font-medium">ID:</span> {user.id}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Username:</span> {user.username}</p>
                </CardContent>
            </Card>

            <Card className="bg-transparent shadow-lg border-slate-500/20">
                <CardHeader className="flex items-center gap-2">
                    <Key className="text-green-500"/>
                    <CardTitle>Roles</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                        <Badge key={role} variant="secondary">
                            {role}
                        </Badge>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-transparent shadow-lg border-slate-500/20">
                <CardHeader className="flex items-center gap-2">
                    <Calendar className="text-purple-500"/>
                    <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p>
                        <span className="font-medium">Created At:</span>{" "}
                        {new Date(user.createdAt).toLocaleString()}
                    </p>
                    {user.lastLoginAt && (
                        <p>
                            <span className="font-medium">Last Login:</span>{" "}
                            {new Date(user.lastLoginAt).toLocaleString()}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}