import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import axiosInstance from "@/api/axios";
import { Plus } from "lucide-react";
import { queryClient } from "@/main";
import { QUERY_KEYS } from "@/constants";

const rfidTagSchema = z.object({
  epc: z
    .string()
    .min(1, "EPC is required")
    .max(64, "EPC must be at most 64 characters"),
  label: z.string().max(50, "Label must be at most 50 characters").optional(),
});

type RfidTagFormValues = z.infer<typeof rfidTagSchema>;

export default function AddRfidTagDialog() {
  const { toast } = useToast();

  const form = useForm<RfidTagFormValues>({
    resolver: zodResolver(rfidTagSchema),
    defaultValues: {
      epc: "",
      label: "",
    },
  });

  const onSubmit = async (values: RfidTagFormValues) => {
    try {
      await axiosInstance.post("/rfid-tag", {
        epc: values.epc,
        label: values.label || undefined,
      });

      toast({
        title: "RFID Tag Created",
        description: "RFID tag has been successfully registered.",
      });

      form.reset();
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RFID_TAGS],
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create RFID tag",
        description:
          error?.response?.data?.message ||
          "Something went wrong while creating RFID tag.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add RFID Tag
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Add New RFID Tag</DialogTitle>
          <DialogDescription>
            Register a new UHF RFID tag into the system. Enter the tag's EPC and
            an optional label.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* EPC */}
            <FormField
              control={form.control}
              name='epc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EPC (Tag ID)</FormLabel>
                  <FormControl>
                    <Input placeholder='E20034120...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Label */}
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Label{" "}
                    <span className='text-muted-foreground font-normal'>
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Tag #001' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit' className='w-full'>
                Create RFID Tag
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
