import {ReportReason} from "./ReportReason.ts";
import {ReportType} from "./ReportType.ts";

export interface ReportCreationDto {
    reportType: ReportType;
    reportedEntityId: string;
    reporterUsername: string;
    reason: ReportReason;
    additionalNotes?: string;
}



