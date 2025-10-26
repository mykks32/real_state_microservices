import {IUser} from "@/interfaces/auth/IUser";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";

export default function UserDetailsCard({user}: {user: Omit<IUser, 'password'>}) {
    return (
        <Card className="bg-transparent border-slate-500/30 shadow-lg">
            <CardHeader>
                <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow className="border-b border-slate-500/30">
                            <TableCell className="font-medium">ID</TableCell>
                            <TableCell>{user.id}</TableCell>
                        </TableRow>
                        <TableRow className="border-b border-slate-500/30">
                            <TableCell className="font-medium">Email</TableCell>
                            <TableCell>{user.email}</TableCell>
                        </TableRow>
                        <TableRow className="border-b border-slate-500/30">
                            <TableCell className="font-medium">Username</TableCell>
                            <TableCell>{user.username}</TableCell>
                        </TableRow>
                        <TableRow className="border-b border-slate-500/30">
                            <TableCell className="font-medium">Roles</TableCell>
                            <TableCell>{user.roles.join(", ")}</TableCell>
                        </TableRow>
                        <TableRow className="border-b border-slate-500/30">
                            <TableCell className="font-medium">Created At</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-b border-slate-500/30">
                            <TableCell className="font-medium">Last Login</TableCell>
                            <TableCell>
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleString()
                                    : "N/A"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}