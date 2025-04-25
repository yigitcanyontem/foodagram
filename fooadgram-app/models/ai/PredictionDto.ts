export type PredictionDto = {
    approved: boolean;
    food_percentage: string;
    prediction: string;
    confidence?: string;
    image_id?: string;
    reason?: string;
    requires_manual_verification?: boolean;
};
