import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";
import { Device } from "@/types/device";
import { QUERY_KEYS } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/main";
import { Registration } from "@/types/registration";

interface AssignDeviceModalProps {
  registration: Registration;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AssignDeviceModal({
  registration,
  open,
  setOpen,
}: AssignDeviceModalProps) {
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  // Fetch all devices
  const { data: devices = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICES],
    queryFn: async (): Promise<Device[]> =>
      (await axiosInstance.get("/device")).data.data,
  });

  // Filter devices that are not assigned to any registration
  const availableDevices = devices.filter(
    (device) => device.registration === null,
  );

  const assignDeviceMutation = useMutation({
    mutationFn: async (deviceID: string) => {
      await axiosInstance.patch(`/device/assign/${deviceID}`, {
        registrationId: registration._id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Device Assigned",
        description: "Successfully assigned hardware to participant.",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REGISTRATIONS] });
      setOpen(false);
      setSelectedDevice(""); // Reset selection
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Assinging Device",
        description: error.response?.data?.message || "Failed to assign device",
      });
    },
  });

  const handleAssign = () => {
    if (!selectedDevice) return;
    assignDeviceMutation.mutate(selectedDevice);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Assign Hardware</DialogTitle>
          <DialogDescription>
            Select an available tracking device to assign to{" "}
            {registration.user.name}.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          {isLoading ? (
            <p className='text-sm text-muted-foreground'>
              Loading available devices...
            </p>
          ) : availableDevices.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No available devices found. All devices are currently assigned.
            </p>
          ) : (
            <div className='flex flex-col gap-4'>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a device' />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.map((device) => (
                    <SelectItem key={device._id} value={device._id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDevice || assignDeviceMutation.isPending}
          >
            {assignDeviceMutation.isPending ? "Assigning..." : "Assign Device"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
