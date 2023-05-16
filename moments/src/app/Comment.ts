export interface Comment {
  momentId: number;
  id?: number;
  text: string;
  username:string;
  created_at?:string;
  updated_at?:string;
}
