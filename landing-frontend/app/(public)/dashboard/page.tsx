"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import useAuthStore from "@/stores/useAuthStore";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { User, Key, Calendar } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/app/(public)/dashboard/columns";
import PropertyService from "@/services/property-service";
import { IProperty } from "@/interfaces/property/property.interface";

export default function Dashboard() {
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);

    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    // React Query hook
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["allProperties", page, size],
        queryFn: () => PropertyService.getAllProperty(page, size),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    const properties = data?.data || [];
    const meta = data?.meta || {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
    };

    if (isLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading properties.";

        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading properties: {errorMessage}</p>
            </div>
        );
    }

    return (
        <section>
            <div className="min-h-screen p-8 flex flex-col gap-6">
                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
                    <Button variant="destructive" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-transparent shadow-lg border-slate-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <User className="text-blue-500" />
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
                            <Key className="text-green-500" />
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
                            <Calendar className="text-purple-500" />
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

                {/* Tabs */}
                <Tabs defaultValue="details" className="mt-6">
                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                        <TabsTrigger value="property">Properties</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">ID</TableCell>
                                            <TableCell>{user.id}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Email</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Username</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Roles</TableCell>
                                            <TableCell>{user.roles.join(", ")}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Created At</TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
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
                    </TabsContent>

                    <TabsContent value="raw">
                        <Card className="bg-transparent shadow-lg border-slate-500/20">
                            <CardContent>
                                <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="property">
                        <DataTable columns={columns} data={properties || []} />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}