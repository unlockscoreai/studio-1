'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UploadCloud } from "lucide-react";
import { UploadResponseDialog } from "@/components/client/upload-response-dialog";
import { useState } from "react";

// Mock data matching the dashboard for consistency
const allDisputes = [
  // Active items still in progress
  { id: 5, bureau: 'Experian', item: 'Late Payment - Capital One', status: 'Submitted', statusVariant: 'secondary' as const, date: '2024-07-10' },
  { id: 6, bureau: 'Equifax', item: 'Incorrect Balance - Chase', status: 'Bureau Responded', statusVariant: 'outline' as const, date: '2024-07-08' },
  { id: 7, bureau: 'TransUnion', item: 'Unknown Inquiry', status: 'Submitted', statusVariant: 'secondary' as const, date: '2024-07-05' },
  // Successfully removed items
  { id: 1, bureau: 'Experian', item: 'Collection Account - XYZ', status: 'Removed', statusVariant: 'default' as const, date: '2024-06-20' },
  { id: 2, bureau: 'TransUnion', item: 'Old Medical Bill', status: 'Removed', statusVariant: 'default' as const, date: '2024-06-15' },
  { id: 3, bureau: 'Equifax', item: 'Duplicate Inquiry', status: 'Removed', statusVariant: 'default' as const, date: '2024-05-30' },
  { id: 4, bureau: 'Experian', item: 'Incorrect Address History', status: 'Removed', statusVariant: 'default' as const, date: '2024-05-25' },
];

export type Dispute = typeof allDisputes[0];

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUploadClick = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Disputes</CardTitle>
          <CardDescription>
            Track all your dispute history here and upload bureau responses for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bureau</TableHead>
                <TableHead>Disputed Item</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-medium">{dispute.bureau}</TableCell>
                  <TableCell>{dispute.item}</TableCell>
                  <TableCell>{dispute.date}</TableCell>
                  <TableCell>
                    <Badge variant={dispute.statusVariant} className={dispute.status === 'Removed' ? 'bg-green-600 hover:bg-green-600/80' : ''}>
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {dispute.status !== 'Removed' && (
                      <Button variant="outline" size="sm" onClick={() => handleUploadClick(dispute)}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Response
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedDispute && (
        <UploadResponseDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            dispute={selectedDispute}
        />
      )}
    </>
  );
}
