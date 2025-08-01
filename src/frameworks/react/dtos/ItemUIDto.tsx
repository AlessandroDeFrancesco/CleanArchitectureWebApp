import type { FormImageUIDto, ImageUIDto } from "./ImageUIDto";

export type ItemUIDto = {
  id: string;
  name: string;
  description: string;
  images: ImageUIDto[];
};


export type FormItemUIDto = Omit<ItemUIDto, 'id' | 'images'> & {
  id?: string,
  images: FormImageUIDto[]
}