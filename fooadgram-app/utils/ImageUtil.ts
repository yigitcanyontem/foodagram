export const ImageUtil = {
    getFormDataFrom: (fileUri: string, fileName: string): FormData => {
        fileUri = fileUri.replace('file:/data', 'file:///data');

        let type = fileUri.substring(fileUri.lastIndexOf(".") + 1);
        const formData = new FormData();
        formData.append('file', { uri: fileUri, name: fileName, type: `image/${type}` } as any);

        return formData;
    }
}
