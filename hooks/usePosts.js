import { useState } from "react";

import useApp from "./useApp";

/**
 * Hook for managing various post-related API operations.
 * @returns {{
 *   addPost: (payload: object) => Promise<any>,
 *   addComment: (postId: number, payload: object) => Promise<any>,
 *   getPosts: () => Promise<any>,
 *   getPost: (postId: number) => Promise<any>,
 *   getComments: (postId: number) => Promise<any>,
 *   uploadImage: (image: string) => Promise<any>,
 *   deletePost: (postId: number) => Promise<any>,
 *   reviewPost: (postId: number) => Promise<any>,
 *   reactOnPost: (postId: number, payload: object) => Promise<any>
 *   timeSpendOnPost: (postId: number, payload: object) => Promise<any>
 * }}
 */
function usePosts() {
    const { api } = useApp();
    const [loading, setLoading] = useState();

    /**
     * Get comments for a specific post.
     * @param {number} postId - ID of the post.
     * @returns {Promise<any>} - Comments data.
     */
    const getComments = async (postId, page = 1) => {
        const { data } = await api.get(
            `/posts/${postId}/comments?page=${page}&limit=5`,
        );
        return data;
    };

    /**
     * Add a comment to a specific post.
     * @param {number} postId - ID of the post.
     * @param {object} payload - Comment payload.
     * @returns {Promise<any>} - Result after adding the comment.
     */
    const addComment = async (postId, payload) => {
        console.log(postId, payload, "addd-co-:");
        const { data } = await api.post(`/posts/${postId}/comments`, payload);
        return data;
    };

    /**
     * Add a reply to a specific comment.
     */
    const addCommentReply = async (parentId, postId, payload) => {
        const { data } = await api.post(
            `/posts/${postId}/comments/${parentId}/replies`,
            payload,
        );
        return data;
    };

    const addCommentLike = async (postId, commentId) => {
        const { data } = await api.post(
            `/posts/${postId}/comments/${commentId}/like`,
        );
        return data;
    };

    /**
     * Delete a comment to a specific post.
     * @param {number} commentId - ID of the comment.
     * @returns {Promise<any>} - Result after deleting the comment.
     */
    const deleteComment = async (commentId) => {
        const { data } = await api.delete(`/posts/${commentId}/comments`);
        return data;
    };

    /**
     * Retrieve all posts.
     * @returns {Promise<any>} - Posts data.
     */
    const getPosts = async () => {
        const { data } = await api.get(`/posts`);
        return data;
    };

    /**
     * Retrieve a specific post by ID.
     * @param {number} postId - ID of the post to retrieve.
     * @returns {Promise<any>} - Post data.
     */
    const getPost = async (postId) => {
        const { data } = await api.get(`/posts/${postId}`);
        return data;
    };
    const getReplies = async (postId, page = 1) => {
        const { data } = await api.get(
            `/posts/${postId}/replies?page=${page}&limit=5`,
        );
        return data;
    };

    const getSharedPost = async (postId) => {
        const { data } = await api.get(`/posts/link/${postId}`);
        return data;
    };

    /**
     * Delete a post by ID.
     * @param {number} postId - ID of the post to delete.
     * @returns {Promise<any>} - Deletion result.
     */
    const deletePost = async (postId) => {
        const { data } = await api.delete(`/posts/${postId}`);
        return data;
    };

    /**
     * Add a new post.
     * @param {object} payload - Post data to add.
     * @returns {Promise<any>} - Result after adding the post.
     */
    const addPost = async (payload) => {
        setLoading(true);
        const { data } = await api.post(`/posts`, payload);
        setLoading(false);
        return data;
    };

    /**
     * BetaReview a post by ID.
     * @param {number} postId - ID of the post to review.
     * @returns {Promise<any>} - BetaReview result.
     */
    const reviewPost = async (postId, channelIds, unburstChannelIds) => {
        const { data } = await api.post(`/posts/${postId}/betareview`, {
            channelIds,
            unburstChannelIds,
        });
        return data;
    };

    /**
     * React to a post by ID.
     * @param {number} postId - ID of the post to react to.
     * @param {object} payload - Reaction payload.
     * @returns {Promise<any>} - Result of the reaction.
     */
    const reactOnPost = async (postId, payload) => {
        const { data } = await api.post(`/posts/${postId}/reactions`, payload);
        return data;
    };

    /**
     * Upload an image for a post.
     * @param {string} [image=""] - Image data to upload.
     * @returns {Promise<any>} - Result of the image upload.
     */
    const uploadImage = async (image = "") => {
        const { data } = await api.post("/posts/imageUpload", { image });
        return data;
    };

    /**
     * Send time send on post by user.
     * @param {number} postId - ID of the post.
     * @param {object} payload - Time spend payload.
     * @returns {Promise<any>} - Result of the time spends.
     */
    const timeSpendOnPost = async (postId, payload) => {
        let data;
        try {
            if (!postId) return;
            setLoading(true);
            const res = await api.post(`/posts/${postId}/watch`, payload);
            data = res.data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return data;
    };

    /**
     * Send time send on post by user.
     * @param {number} postId - ID of the post.
     * @param {object} channelId - ID of Channel.
     * @returns {Promise<any>} - .
     */
    const removePostFromChannel = async (postId, channelId) => {
        try {
            const res = await api.put(
                `/posts/remove-from-channel/${postId}/${channelId}`,
            );
            return res;
        } catch (error) {
            throw error;
        }
    };

    return {
        addPost,
        addComment,
        getPosts,
        getPost,
        getComments,
        uploadImage,
        deletePost,
        reviewPost,
        reactOnPost,
        deleteComment,
        timeSpendOnPost,
        loading,
        setLoading,
        addCommentReply,
        addCommentLike,
        getReplies,
        removePostFromChannel,
        getSharedPost,
    };
}

export default usePosts;
