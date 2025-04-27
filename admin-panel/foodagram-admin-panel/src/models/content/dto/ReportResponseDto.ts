import {ReportType} from "./ReportType.ts";
import {ReportReason} from "./ReportReason.ts";

export interface ReportResponseDto {
    reportId: string;
    reporterId: string;
    reporterUsername: string;
    reportType: ReportType;
    reportedEntityId: string;
    reason: ReportReason;
    additionalNotes?: string;
    resolved: boolean;
    resolvedAt?: Date;
    resolutionNotes?: string;
    resolverId?: string;
}
