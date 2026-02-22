import { Registration } from "@/types/registration";
import axiosInstance from "@/api/axios";
import { useState } from "react";
import { Button } from "../ui/button";
import { RegisterEventDialog } from "../forms/RegisterEventForm";
import { Event } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { useUserStore } from "@/stores/user";

type EventActionButtonProps = {
  event: Event;
};

export function ClientEventActionButton({ event }: EventActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore((state) => state);

  const { data: registration } = useQuery({
    queryKey: [
      QUERY_KEYS.REGISTRATIONS,
      { userID: user._id, eventID: event._id },
    ],
    queryFn: async (): Promise<Registration> => {
      const { data } = await axiosInstance.get(`/registration`, {
        params: { userID: user._id, eventID: event._id },
      });
      return data.data[0] || null;
    },
  });

  const handlePayment = async () => {
    if (!registration) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/payment/create", {
        registrationId: registration._id,
      });
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (registration) {
    // Already registered
    return (
      <div className='flex gap-2'>
        <Button disabled variant='outline' size='sm'>
          Registered
        </Button>
        {registration.status === "pending" && (
          <Button onClick={handlePayment} size='sm' disabled={loading}>
            Pay now
          </Button>
        )}
        {registration.status === "confirmed" && (
          <Button disabled size='sm'>
            Paid
          </Button>
        )}
      </div>
    );
  }

  // Not registered yet
  return <RegisterEventDialog event={event} />;
}
