import { useCallback } from "react";

export const useBase64Image = () => {
    const getBase64Uri = useCallback((base64: string, mimeType: string = "image/jpeg"): string => {
        return base64 ? `data:${mimeType};base64,${base64}` : "";
    }, []);

    return { getBase64Uri };
};
