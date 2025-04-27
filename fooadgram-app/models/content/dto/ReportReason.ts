export enum ReportReason {
    SPAM="SPAM",
    HATE_SPEECH="HATE SPEECH",
    HARASSMENT="HARASSMENT",
    NON_FOOD_RELATED_POST="NON FOOD RELATED POST",
    ABUSIVE_LANGUAGE="ABUSIVE LANGUAGE",
    OTHER="OTHER"
}
export const reportReasonMap: { [key: string]: string } = Object.keys(ReportReason).reduce((acc, key) => {
    acc[key] = ReportReason[key as keyof typeof ReportReason];
    return acc;
}, {} as { [key: string]: string });
