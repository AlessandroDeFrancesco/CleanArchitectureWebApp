export type ItemPresenterDto = {
    id: string;
    name: string;
    description: string;
    images: ImagePresenterDto[];
}

export type ImagePresenterDto = {
    id: string;
    name: string,
    mimeType: string,
    contentBase64: string;
}