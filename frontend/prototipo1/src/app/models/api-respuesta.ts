export interface ApiResponse {
  ok: boolean;
  msg: string;
  data: any;
  page?: {
    desde: number;
    registropp: number;
    total: number;
  };
}
