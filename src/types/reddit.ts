export type Post = {
  title: string;
  selftext: string;
  id: string;
  thumbnail: string;
  url: string;
  is_self: boolean;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
  };
};

export type BestPosts = {
  sub: Sub;
  posts: Post[];
};

export type Sub = {
  img: string;
  sub: string;
  id: number;
};
