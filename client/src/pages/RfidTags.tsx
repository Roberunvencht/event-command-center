import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddRfidTagDialog from "@/components/forms/AddRfidTagDialog";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";
import { QUERY_KEYS } from "@/constants";
import { RfidTag } from "@/types/rfid-tag";
import _ from "lodash";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/main";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function RfidTags() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tags } = useQuery({
    queryKey: [QUERY_KEYS.RFID_TAGS],
    queryFn: async (): Promise<RfidTag[]> =>
      (await axiosInstance.get("/rfid-tag")).data.data,
  });

  const handleCopyEpc = async (epc: string) => {
    try {
      await navigator.clipboard.writeText(epc);
      toast({
        title: "Copied",
        description: "EPC copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy EPC",
      });
    }
  };

  const handleUnassign = async (tagID: string) => {
    try {
      await axiosInstance.patch(`/rfid-tag/unassign/${tagID}`);
      toast({
        title: "Unassigned",
        description: "RFID tag unassigned successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RFID_TAGS],
      });
    } catch (error: any) {
      console.error("Failed to unassign RFID tag", error);
      toast({
        variant: "destructive",
        title: "Failed to unassign RFID tag",
        description: error.message ?? "Failed to unassign RFID tag",
      });
    }
  };

  const handleRemoveTag = async (tagID: string) => {
    try {
      await axiosInstance.delete(`/rfid-tag/${tagID}`);
      toast({
        title: "Deleted",
        description: "RFID tag deleted successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RFID_TAGS],
      });
    } catch (error: any) {
      console.error("Failed to delete RFID tag", error);
      toast({
        variant: "destructive",
        title: "Failed to delete RFID tag",
        description: error.message ?? "Failed to delete RFID tag",
      });
    }
  };

  const statusBadge = (status: RfidTag["status"]) => {
    switch (status) {
      case "available":
        return (
          <Badge
            variant='outline'
            className='bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
          >
            Available
          </Badge>
        );
      case "assigned":
        return (
          <Badge
            variant='outline'
            className='bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30'
          >
            Assigned
          </Badge>
        );
      case "retired":
        return (
          <Badge
            variant='outline'
            className='bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30'
          >
            Retired
          </Badge>
        );
    }
  };

  const filteredTags = tags?.filter(
    (tag) =>
      tag.epc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.label?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='space-y-6 animate-appear'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-2'>RFID Tags</h1>
          <p className='text-muted-foreground'>
            Manage UHF RFID tags for race timing
          </p>
        </div>

        <AddRfidTagDialog />
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search by EPC or label...'
                className='pl-9'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button variant='outline' className='gap-2'>
              <Filter className='w-4 h-4' />
              Filters
            </Button>
          </div>

          <div className='rounded-lg border border-border overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead>EPC</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTags &&
                  filteredTags.map((tag) => (
                    <TableRow key={tag._id} className='hover:bg-muted/30'>
                      <TableCell className='font-mono text-sm'>
                        <div className='flex items-center'>
                          {_.truncate(tag.epc, { length: 24 })}
                          <Copy
                            onClick={() => handleCopyEpc(tag.epc)}
                            className='w-4 h-4 ml-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors'
                          />
                        </div>
                      </TableCell>

                      <TableCell className='font-medium'>
                        {tag.label || (
                          <span className='text-muted-foreground'>--</span>
                        )}
                      </TableCell>

                      <TableCell>{statusBadge(tag.status)}</TableCell>

                      <TableCell className='text-muted-foreground'>
                        {tag.registration?.user?.name
                          ? _.startCase(tag.registration.user.name)
                          : "--"}
                      </TableCell>

                      <TableCell className='text-muted-foreground'>
                        {tag.registration?.event?.name
                          ? _.startCase(tag.registration.event.name)
                          : tag.event?.name
                            ? _.startCase(tag.event.name)
                            : "--"}
                      </TableCell>

                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align='end'>
                            {tag.status === "assigned" && (
                              <DropdownMenuItem>
                                <button onClick={() => handleUnassign(tag._id)}>
                                  Unassign Tag
                                </button>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem className='text-destructive'>
                              <ConfirmDialog
                                onConfirm={() => handleRemoveTag(tag._id)}
                                trigger={<button>Remove Tag</button>}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                {(!filteredTags || filteredTags.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-8 text-muted-foreground'
                    >
                      No RFID tags found. Add a tag to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
