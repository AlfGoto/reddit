import type { Session } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostRenderer from "./TextRenderer";
import Image from "next/image";
import type { Post } from "@/types/reddit";
import { getBetters } from "@/lib/reddit/getBetters";
import { SubHeader } from "./SubHeader";

interface SubredditPostsProps {
  session: Session;
}

export default async function SubredditPosts({ session }: SubredditPostsProps) {
  const data = await getBetters(session);

  return (
    <div className="space-y-12">
      {data.map((subData) => {
        const displayPosts = subData.posts;

        return (
          <section
            key={subData.sub.sub}
            className="rounded-lg border bg-card p-4 shadow-sm md:p-6 flex flex-col gap-2"
          >
            <SubHeader sub={subData.sub} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const contentPreview =
    post.selftext && post.selftext.length > 150
      ? `${post.selftext.substring(0, 150)}...`
      : post.selftext;

  const getBestImage = () => {
    if (post.preview?.images?.[0]) {
      const resolutions = post.preview.images[0].resolutions;
      if (resolutions.length > 0) {
        const mediumRes =
          resolutions.find((r) => r.width >= 640) ||
          resolutions[resolutions.length - 1];
        return mediumRes.url.replace(/&amp;/g, "&");
      }
      return post.preview.images[0].source.url.replace(/&amp;/g, "&");
    }
    return post.thumbnail &&
      post.thumbnail !== "self" &&
      post.thumbnail !== "default"
      ? post.thumbnail
      : null;
  };

  const bestImage = getBestImage();

  const isImageUrl = post.url?.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  const imageToShow = isImageUrl ? post.url : bestImage;

  return (
    <Card className="h-full flex flex-col max-w-full overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer flex-grow">
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-base md:text-lg">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {post.is_self ? (
                <div className="max-h-24 overflow-hidden text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {contentPreview ? (
                    <PostRenderer content={contentPreview} />
                  ) : (
                    <p className="italic text-muted-foreground">
                      No text content
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {post.thumbnail &&
                    post.thumbnail !== "self" &&
                    post.thumbnail !== "default" && (
                      <div className="relative h-20 w-full overflow-hidden rounded-md">
                        <Image
                          src={imageToShow!}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogDescription></DialogDescription>
          <DialogHeader>
            <DialogTitle>{post.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {imageToShow && (
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={imageToShow}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="w-full object-contain"
                  unoptimized
                />
              </div>
            )}

            {/* Show text content if it's a self post */}
            {post.is_self && post.selftext ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <PostRenderer content={post.selftext} />
              </div>
            ) : (
              <div className="space-y-4">
                {!post.selftext && !imageToShow && (
                  <p className="italic text-muted-foreground">
                    No content available
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
