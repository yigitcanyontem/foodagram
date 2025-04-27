import {ReportReason} from "@/models/content/dto/ReportReason";
import {ReportType} from "@/models/content/dto/ReportType";

export interface ReportCreationDto {
    reportType: ReportType;
    reportedEntityId: string;
    reporterUsername: string;
    reason: ReportReason;
    additionalNotes?: string;
}



