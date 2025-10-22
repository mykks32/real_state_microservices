import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="min-h-full p-8 flex flex-col gap-8 items-center">

            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 text-center">
                About RealState
            </h1>
            <p className="text-gray-700 text-center max-w-xl">
                RealState is your trusted platform for finding modern apartments, luxurious villas, and commercial properties.
                We make property search simple, transparent, and tailored to your lifestyle.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Explore Properties
            </Button>

            {/* Features Cards */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Trusted Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        We carefully verify every property to ensure accurate and up-to-date information.
                    </CardContent>
                </Card>

                <Card className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Premium Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Our dedicated support team is here to help you find your perfect property.
                    </CardContent>
                </Card>

                <Card className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Easy & Transparent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Enjoy a seamless search and booking experience with complete transparency.
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}