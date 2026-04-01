"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchComments, postComment, deleteComment } from "@/features/comment/commentSlice";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

interface CommentsProps {
  videoId: string;
  commentCount: number;
}

export default function Comments({ videoId, commentCount }: CommentsProps) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { comments, isLoading, isPosting, total } = useAppSelector((s) => s.comment);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchComments(videoId));
  }, [videoId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Sign in to comment"); return; }
    if (!content.trim()) return;
    await dispatch(postComment({ videoId, content: content.trim() }));
    setContent("");
    toast.success("Comment posted!");
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!session) { toast.error("Sign in to reply"); return; }
    if (!replyContent.trim()) return;
    await dispatch(postComment({ videoId, content: replyContent.trim(), parentId }));
    setReplyContent("");
    setReplyTo(null);
    setExpandedReplies((prev) => new Set([...prev, parentId]));
    toast.success("Reply posted!");
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    await dispatch(deleteComment(commentId));
    toast.success("Comment deleted");
  };

  const userId = (session?.user as any)?.id;
  const isAdmin = ["admin", "superadmin"].includes((session?.user as any)?.role);

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle size={20} className="text-ps5-blue" />
        <h3 className="font-display font-bold text-lg text-white">
          Comments <span className="text-ps5-text-muted font-normal text-base ml-1">({total})</span>
        </h3>
      </div>

      {/* Comment Input */}
      <div className="flex gap-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-ps5-surface border border-ps5-border flex items-center justify-center flex-shrink-0 overflow-hidden">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full object-cover" />
          ) : (
            <span className="text-white text-sm font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={session ? "Add a comment..." : "Sign in to comment"}
            disabled={!session}
            rows={2}
            className="w-full bg-transparent border-b border-ps5-border focus:border-ps5-blue text-white placeholder-ps5-text-muted text-sm resize-none focus:outline-none transition-colors duration-200 pb-2"
          />
          <AnimatePresence>
            {(content.trim() || replyTo) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex justify-end gap-2 mt-2"
              >
                <button
                  type="button"
                  onClick={() => setContent("")}
                  className="px-4 py-1.5 text-ps5-text-secondary hover:text-white text-sm rounded-lg hover:bg-ps5-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting || !content.trim()}
                  className="flex items-center gap-2 px-4 py-1.5 bg-ps5-blue hover:bg-ps5-blue-light text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isPosting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Post
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-1/4 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 group"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-ps5-surface border border-ps5-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                {comment.author?.image ? (
                  <Image src={comment.author.image} alt="" width={36} height={36} className="object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {comment.author?.name?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-semibold">{comment.author?.name}</span>
                  <span className="text-ps5-text-muted text-xs">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                  {comment.isEdited && (
                    <span className="text-ps5-text-muted text-xs">(edited)</span>
                  )}
                </div>

                <p className="text-ps5-text-secondary text-sm leading-relaxed">{comment.content}</p>

                {/* Comment Actions */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      session
                        ? setReplyTo({ id: comment._id, name: comment.author?.name || "" })
                        : toast.error("Sign in to reply")
                    }
                    className="text-ps5-text-muted hover:text-ps5-blue text-xs font-semibold transition-colors"
                  >
                    Reply
                  </button>

                  {(userId === comment.author?._id || isAdmin) && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-ps5-text-muted hover:text-ps5-danger text-xs transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}

                  {/* Toggle Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedReplies((prev) => {
                          const next = new Set(prev);
                          next.has(comment._id) ? next.delete(comment._id) : next.add(comment._id);
                          return next;
                        })
                      }
                      className="flex items-center gap-1 text-ps5-blue text-xs font-semibold hover:underline"
                    >
                      {expandedReplies.has(comment._id) ? (
                        <><ChevronUp size={12} /> Hide {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</>
                      ) : (
                        <><ChevronDown size={12} /> {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</>
                      )}
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {replyTo?.id === comment._id && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={(e) => handleReply(e, comment._id)}
                      className="mt-3 flex gap-2"
                    >
                      <textarea
                        autoFocus
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to @${replyTo.name}...`}
                        rows={1}
                        className="flex-1 bg-transparent border-b border-ps5-border focus:border-ps5-blue text-white placeholder-ps5-text-muted text-sm resize-none focus:outline-none transition-colors pb-1"
                      />
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="text-ps5-text-muted hover:text-white text-sm px-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPosting || !replyContent.trim()}
                        className="flex items-center gap-1 px-3 py-1 bg-ps5-blue text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                      >
                        {isPosting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Replies */}
                <AnimatePresence>
                  {expandedReplies.has(comment._id) && comment.replies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4 pl-4 border-l-2 border-ps5-border"
                    >
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-3 group/reply">
                          <div className="w-7 h-7 rounded-full bg-ps5-surface border border-ps5-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {reply.author?.image ? (
                              <Image src={reply.author.image} alt="" width={28} height={28} className="object-cover" />
                            ) : (
                              <span className="text-white text-xs font-bold">
                                {reply.author?.name?.[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white text-xs font-semibold">{reply.author?.name}</span>
                              <span className="text-ps5-text-muted text-[11px]">
                                {formatRelativeTime(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-ps5-text-secondary text-sm leading-relaxed">{reply.content}</p>
                            {(userId === reply.author?._id || isAdmin) && (
                              <button
                                onClick={() => handleDelete(reply._id)}
                                className="text-ps5-text-muted hover:text-ps5-danger text-xs mt-1 opacity-0 group-hover/reply:opacity-100 transition-all"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
