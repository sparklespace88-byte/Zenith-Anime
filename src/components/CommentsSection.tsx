import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Trash2, Send, ShieldAlert } from 'lucide-react';

interface CommentsSectionProps {
  animeId: string;
  episodeId?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ animeId, episodeId }) => {
  const {
    comments,
    currentUser,
    addComment,
    addReply,
    likeComment,
    dislikeComment,
    deleteComment,
    openAuthModal
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(10);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('newest');

  // Filter comments for this anime / episode
  const relevantComments = comments.filter(c => c.animeId === animeId);

  const sortedComments = [...relevantComments].sort((a, b) => {
    if (sortBy === 'top') {
      return (b.likes - b.dislikes) - (a.likes - a.dislikes);
    }
    return 0; // default order is newest first as created in context
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    addComment(animeId, commentText, selectedRating, episodeId);
    setCommentText('');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    addReply(commentId, replyText);
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <span>Discussion & Reviews</span>
            <span className="text-sm font-normal text-neutral-400">({relevantComments.length})</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Share your analysis, thoughts, and episode reactions with the community.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#121520] border border-white/10 text-xs">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              sortBy === 'newest' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              sortBy === 'top' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Most Liked
          </button>
        </div>
      </div>

      {/* New Comment Submission Box */}
      <form onSubmit={handlePostComment} className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
        {/* Rating stars selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-300 font-medium">Your Score:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setSelectedRating(star)}
                className="p-0.5 focus:outline-none"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    (hoverRating !== null ? star <= hoverRating : star <= selectedRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-400 tabular-nums">
            {hoverRating !== null ? hoverRating : selectedRating}/10
          </span>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              currentUser
                ? 'What did you think of the animation, plot, and characters? Leave a review...'
                : 'Sign in to join the discussion...'
            }
            rows={3}
            className="w-full bg-[#0b0d14] text-neutral-200 p-3 rounded-lg border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-purple-500/60 placeholder:text-neutral-500 resize-none transition-all"
          />
        </div>

        {/* Bottom submit row */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            Be respectful and avoid unflagged major spoilers.
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-600/30 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Review</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl border border-white/5">
            <MessageSquare className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-400 font-medium">No reviews yet for this title.</p>
            <p className="text-xs text-neutral-500 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const isOwner = currentUser?.id === comment.userId;
            const isAdmin = currentUser?.role === 'admin';

            return (
              <div
                key={comment.id}
                className="glass-panel p-4 rounded-xl border border-white/5 space-y-3 transition-colors hover:border-white/10"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{comment.userName}</span>
                        {comment.userRole === 'admin' && (
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-400/10 px-1.5 py-0.5 rounded">
                            Staff
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>{comment.createdAt}</span>
                        {comment.rating && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {comment.rating}/10
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Delete if owner or admin) */}
                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      title={isAdmin && !isOwner ? 'Admin Moderation: Delete comment' : 'Delete comment'}
                    >
                      {isAdmin && !isOwner ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed pl-12">
                  {comment.text}
                </p>

                {/* Interaction Row (Like, Dislike, Reply) */}
                <div className="flex items-center gap-4 pl-12 pt-1 text-xs text-neutral-400">
                  <button
                    onClick={() => likeComment(comment.id)}
                    className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                      comment.userVoted === 'like' ? 'text-purple-400 font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => dislikeComment(comment.id)}
                    className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                      comment.userVoted === 'dislike' ? 'text-rose-400 font-bold' : ''
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{comment.dislikes}</span>
                  </button>

                  <button
                    onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply Form */}
                {activeReplyId === comment.id && (
                  <div className="pl-12 pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.userName}...`}
                      className="flex-1 bg-[#090b11] text-neutral-200 px-3 py-1.5 rounded-lg border border-white/10 text-xs focus:outline-none focus:border-purple-500/60"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePostReply(comment.id);
                      }}
                    />
                    <button
                      onClick={() => handlePostReply(comment.id)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Send
                    </button>
                  </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-12 space-y-2 pt-2 border-t border-white/5 mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2.5 bg-white/[0.02] p-2.5 rounded-lg">
                        <UserAvatar
                          src={reply.userAvatar}
                          alt={reply.userName}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{reply.userName}</span>
                            {reply.userRole === 'admin' && (
                              <span className="text-[9px] text-amber-400 font-bold uppercase">Staff</span>
                            )}
                            <span className="text-[10px] text-neutral-500">{reply.createdAt}</span>
                          </div>
                          <p className="text-xs text-neutral-300 mt-1">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
