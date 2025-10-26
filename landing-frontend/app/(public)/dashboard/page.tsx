"use client";

import {lazy, Suspense, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Plus} from "lucide-react";
import {Role} from "@/enums";
import CreatePropertyDialog from "@/components/Dashboard/Seller/Dialog/create-property-dialog";
import {CreatePropertyDTO} from "@/schemas/property/property-schema";
import {useMutation, useQueryClient} from "react-query";
import SellerPropertyService from "@/services/property/seller-property-serive"
import AdminPropertyService from "@/services/property/admin-property-service"

// Lazy-load PropertyTab
const AdminPropertyTab = lazy(() => import("@/components/Dashboard/Admin/Tabs/property-tab"));
const SellerPropertyTab = lazy(() => import("@/components/Dashboard/Seller/Tabs/property-tab"));
const UserDetailsCard = lazy(() => import("@/components/Dashboard/common/UserDetailsCard"));
const DashboardCards = lazy(() => import("@/components/Dashboard/common/DashboardCard"));

type IActiveTab = "details" | "admin-property" | "seller-property";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<IActiveTab>("details");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const queryClient = useQueryClient()


    const draftPropertyMutation = useMutation({
        mutationFn: async (data: CreatePropertyDTO) => {
            await SellerPropertyService.createProperty(data);
        },
        onSuccess: () => {
            setIsDialogOpen(false)
            queryClient
                .invalidateQueries({ queryKey: ["seller-properties"] })
                .then(() => {
                    console.log("Query invalidated successfully");
                })
                .catch((err) => {
                    console.error("Invalidation failed:", err);
                });
        },
        onError: (error: any) => {
            console.error("Update property error:", error)
        }
    });

    const approvedPropertyMutation = useMutation({
        mutationFn: async (data: CreatePropertyDTO) => {
            await AdminPropertyService.createApprovedProperty(data);
        },
        onSuccess: () => {
            setIsDialogOpen(false)
            queryClient
                .invalidateQueries({ queryKey: ["all-properties"] })
                .then(() => {
                    console.log("Query invalidated successfully");
                })
                .catch((err) => {
                    console.error("Invalidation failed:", err);
                });
        },
        onError: (error: any) => {
            console.error("Update property error:", error)
        }
    });

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    const handleDraftProperty = (data: CreatePropertyDTO) => {
        draftPropertyMutation.mutate(data)
    };

    const handleApprovedProperty = (data: CreatePropertyDTO) => {
        approvedPropertyMutation.mutate(data)
    }

    if (loading || !user) {
        return (
            <div className="h-20 w-full items-center justify-center flex">
                <Spinner/>
            </div>
        );
    }

    return (
        <section>
            <div className="min-h-screen p-8 flex flex-col gap-6">
                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Post Seller Property Button */}
                        {user.roles.includes(Role.SELLER) && (
                            <CreatePropertyDialog
                                isOpen={isDialogOpen}
                                createType={"Draft"}
                                onClose={() => setIsDialogOpen(false)}
                                onSubmit={handleDraftProperty}
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
                        {/* Post Property Button */}
                        {user.roles.includes(Role.ADMIN) && (
                            <CreatePropertyDialog
                                createType={"Post"}
                                isOpen={isDialogOpen}
                                onClose={() => setIsDialogOpen(false)}
                                onSubmit={handleApprovedProperty}
                                trigger={
                                    <Button
                                        className="bg-blue-500 text-white px-4 py-2"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <Plus size={16}/> Post Property
                                    </Button>
                                }
                            />
                        )}

                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                {/*Dashboard Cards*/}
                <div className="hidden md:block">
                    <Suspense
                        fallback={
                            <div className="h-20 w-full items-center justify-center flex">
                                <Spinner/>
                            </div>
                        }>
                        <DashboardCards user={user}/>
                    </Suspense>
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
                        {activeTab === "details" && (
                            <Suspense
                                fallback={
                                    <div className="h-20 w-full items-center justify-center flex">
                                        <Spinner/>
                                    </div>
                                }
                            >
                                <UserDetailsCard user={user}/>
                            </Suspense>
                        )}
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
                                    <SellerPropertyTab />
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
                                    <AdminPropertyTab />
                                </Suspense>
                            )}
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </section>
    );
}