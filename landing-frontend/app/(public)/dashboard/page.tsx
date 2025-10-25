"use client";

import {lazy, Suspense, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import {Spinner} from "@/components/ui/spinner";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {Calendar, Key, Plus, User} from "lucide-react";
import {Role} from "@/enums";
import PropertyDialog from "@/components/Dashboard/Seller/Dialog/property-dialog";
import {CreatePropertyDTO} from "@/schemas/property/property-schema";
import {useMutation} from "react-query";
import SellerPropertyService from "@/services/property/seller-property-serive"

// Lazy-load PropertyTab
const AdminPropertyTab = lazy(() => import("@/components/Dashboard/Admin/Tabs/property-tab"));
const SellerPropertyTab = lazy(() => import("@/components/Dashboard/Seller/Tabs/property-tab"));

type IActiveTab = "details" | "admin-property" | "seller-property";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<IActiveTab>("details");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

    if (loading || !user) {
        return (
            <div className="h-20 w-full items-center justify-center flex">
                <Spinner/>
            </div>
        );
    }

    const draftPropertyMutation = useMutation({
        mutationFn: async (data: CreatePropertyDTO) => {
            await SellerPropertyService.createProperty(data);
        },
    });

    const handleDraftProperty = (data: CreatePropertyDTO) => {
        draftPropertyMutation.mutate(data)
    };

    return (
        <section>
            <div className="min-h-screen p-8 flex flex-col gap-6">
                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Post Property Button */}
                        {user.roles.includes(Role.SELLER) && (
                            <PropertyDialog
                                isOpen={isDialogOpen}
                                onClose={() => setIsDialogOpen(false)}
                                onDraft={handleDraftProperty}
                                trigger={
                                    <Button
                                        className="bg-blue-500 text-white px-4 py-2"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <Plus size={16}/> Draft Property
                                    </Button>
                                }
                            />
                        )}

                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Dashboard Cards */}
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

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as IActiveTab)}
                      className="mt-6">
                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        {user.roles.includes(Role.SELLER) &&
                            <TabsTrigger value="seller-property">Properties</TabsTrigger>}
                        {user.roles.includes(Role.ADMIN) &&
                            <TabsTrigger value="admin-property">Properties</TabsTrigger>}
                    </TabsList>

                    {/* Details Tab */}
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

                    {/* Seller Property Tab (Lazy Loaded) */}
                    {user.roles.includes(Role.SELLER) && (<TabsContent value="seller-property">
                            {activeTab === "seller-property" && (
                                <Suspense
                                    fallback={
                                        <div className="h-20 w-full items-center justify-center flex">
                                            <Spinner/>
                                        </div>
                                    }
                                >
                                    <SellerPropertyTab/>
                                </Suspense>
                            )}
                        </TabsContent>
                    )}

                    {/* Admin Property Tab (Lazy Loaded) */}
                    {user.roles.includes(Role.ADMIN) && (<TabsContent value="admin-property">
                            {activeTab === "admin-property" && (
                                <Suspense
                                    fallback={
                                        <div className="h-20 w-full items-center justify-center flex">
                                            <Spinner/>
                                        </div>
                                    }
                                >
                                    <AdminPropertyTab/>
                                </Suspense>
                            )}
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </section>
    );
}