import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  emergencyName: z.string().min(2, "Emergency contact name is required").max(100),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required").max(20),
  medicalConditions: z.string().max(500).optional(),
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function ClientEventList() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      emergencyName: "",
      emergencyPhone: "",
      medicalConditions: "",
      tshirtSize: "M",
      agreeToTerms: false,
    },
  });

  const events = [
    {
      id: 1,
      name: "City Marathon 2024",
      date: "Jan 15, 2024",
      distance: "42.2 km",
      location: "Downtown",
      techRequired: "RFID",
      organizer: "Running Club",
      status: "registered",
      spotsLeft: 45,
    },
    {
      id: 2,
      name: "Trail Run Challenge",
      date: "Jan 22, 2024",
      distance: "21 km",
      location: "Forest Park",
      techRequired: "Hybrid",
      organizer: "Trail Masters",
      status: "open",
      spotsLeft: 120,
    },
    {
      id: 3,
      name: "Sprint Series #1",
      date: "Jan 29, 2024",
      distance: "10 km",
      location: "City Stadium",
      techRequired: "Running Node",
      organizer: "Speed Demons",
      status: "open",
      spotsLeft: 80,
    },
  ];

  const handleRegisterClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: RegistrationFormValues) => {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    console.log("Registration data:", data, "for event:", selectedEvent?.name);
    
    toast({
      title: "Registration Successful!",
      description: `You've been registered for ${selectedEvent?.name}. Check your email for confirmation.`,
    });
    
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Available Events</h1>
          <p className="text-muted-foreground mt-2">Register for upcoming running events</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search events..." className="max-w-sm" />
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id} className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Organized by {event.organizer}</p>
                </div>
                <Badge
                  variant={event.status === "registered" ? "default" : "secondary"}
                  className={event.status === "registered" ? "bg-teal-500/20 text-teal-700 dark:text-teal-300" : ""}
                >
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Radio className="w-4 h-4 text-primary" />
                  <span>{event.techRequired}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-primary">{event.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {event.spotsLeft} spots remaining
                </span>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/client/events/${event.id}`}>View Details</Link>
                  </Button>
                  {event.status === "open" ? (
                    <Button size="sm" onClick={() => handleRegisterClick(event.id)}>Register</Button>
                  ) : (
                    <Button size="sm" variant="secondary">Registered</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Registration</DialogTitle>
            <DialogDescription>
              Complete the form below to register for {events.find(e => e.id === selectedEventId)?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Emergency Contact</h3>
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Additional Information</h3>
                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any medical conditions, allergies, or information we should know..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tshirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T-Shirt Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        By registering, you agree to our event terms, waiver of liability, and data processing policies.
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Complete Registration</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
