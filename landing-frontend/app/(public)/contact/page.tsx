import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="min-h-screen p-8 flex flex-col gap-12 items-center">

            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 text-center">
                Contact Us
            </h1>
            <p className="text-gray-700 text-center max-w-xl">
                Have questions or want to get in touch? Fill out the form below, and our team will get back to you as soon as possible.
            </p>

            {/* Contact Form Card */}
            <Card className="w-full md:min-w-lg max-w-xl mx-auto shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Name */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <Label>Name</Label>
                            <Input placeholder="Your Name" />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="you@example.com" />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <Label>Message</Label>
                            <Textarea placeholder="Your message..." className="h-32" />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 flex justify-end">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                                Send Message
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="w-full md:min-w-lg max-w-xl mx-auto shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                    <CardTitle>Our Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p>Email: support@realstate.com</p>
                    <p>Phone: +977 9824 812 179</p>
                    <p>Address: Kathmandu, Nepal</p>
                </CardContent>
            </Card>
        </div>
    );
}