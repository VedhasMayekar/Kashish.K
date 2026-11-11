export interface Blog {
  id: number;
  dayNumber: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  senderName: string;
  senderNameRaw: string | null;
  messageContent: string;
  blogId: number | null;
  blogTitle: string | null;
  blogDayNumber: number | null;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
}
