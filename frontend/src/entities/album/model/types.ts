export interface IAlbum {
  title: string;
  year: number;
  cover_url: string | null;
  type: "official" | "unofficial";
  id: number;
  order_index: number;
}
