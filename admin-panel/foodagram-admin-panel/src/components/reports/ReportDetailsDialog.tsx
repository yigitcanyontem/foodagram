import { ReportResponseDto } from '../../models/content/dto/ReportResponseDto';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';

interface ReportDetailsDialogProps {
    report: ReportResponseDto;
    onClose: () => void;
    onResolve: (reportId: string, resolutionNotes: string) => void;
}

export const ReportDetailsDialog = ({
    report,
    onClose,
    onResolve,
}: ReportDetailsDialogProps) => {
    const [resolutionNotes, setResolutionNotes] = useState('');

    const handleResolve = () => {
        onResolve(report.reportId, resolutionNotes);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report Details</DialogTitle>
                    <DialogDescription>
                        Review and resolve the reported content
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Reporter</h4>
                        <p className="text-sm text-muted-foreground">
                            {report.reporterUsername}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Report Type</h4>
                        <p className="text-sm text-muted-foreground">
                            {report.reportType}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Reason</h4>
                        <p className="text-sm text-muted-foreground">
                            {report.reason}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Additional Notes</h4>
                        <p className="text-sm text-muted-foreground">
                            {report.additionalNotes || 'No additional notes provided'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Resolution Notes</h4>
                        <Textarea
                            placeholder="Add notes about how you resolved this report..."
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleResolve}>
                        Resolve Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 
