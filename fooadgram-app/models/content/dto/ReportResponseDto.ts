import {ReportReason} from "@/models/content/dto/ReportReason";
import {ReportType} from "@/models/content/dto/ReportType";

export interface ReportResponseDto {
    id: string;
    reporterId: string;
    reporterUsername: string;
    reportType: ReportType;
    reportedEntityId: string;
    reason: ReportReason;
    additionalNotes?: string;
    resolved: boolean;
}
