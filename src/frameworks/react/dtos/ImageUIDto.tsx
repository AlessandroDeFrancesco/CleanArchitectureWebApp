export type ImageUIDto = {
  id: string;
  name: string;
  mimeType: string;
  contentBase64: string;
};

export type FormImageUIDto = Omit<ImageUIDto, 'id'> & {
  id?: string
}