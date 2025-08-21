import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORE_NAME = 'store'

const initialComments = [
	{
		id: 1,
		content:
			"Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
		createdAt: 1753121889000,
		score: 12,
		user: {
			image: {
				png: 'images/avatars/image-amyrobson.png',
				webp: 'images/avatars/image-amyrobson.webp',
			},
			username: 'amyrobson',
		},
		replies: [],
	},
	{
		id: 2,
		content:
			"Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
		createdAt: 1754589909000,
		score: 5,
		user: {
			image: {
				png: 'images/avatars/image-maxblagun.png',
				webp: 'images/avatars/image-maxblagun.webp',
			},
			username: 'maxblagun',
		},
		replies: [
			{
				id: 3,
				content:
					"If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
				createdAt: 1755195489000,
				score: 4,
				replyingTo: 'maxblagun',
				user: {
					image: {
						png: 'images/avatars/image-ramsesmiron.png',
						webp: 'images/avatars/image-ramsesmiron.webp',
					},
					username: 'ramsesmiron',
				},
			},
			{
				id: 4,
				content:
					"I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
				createdAt: 1755627489000,
				score: 2,
				replyingTo: 'ramsesmiron',
				user: {
					image: {
						png: 'images/avatars/image-juliusomo.png',
						webp: 'images/avatars/image-juliusomo.webp',
					},
					username: 'juliusomo',
				},
			},
		],
	},
]

const getComments = () => {
	const comments = localStorage.getItem(STORE_NAME)

	return comments ? JSON.parse(comments) : initialComments
}

const setLocalStorage = comments => {
	localStorage.setItem(STORE_NAME, JSON.stringify(comments))
}

export const useStore = defineStore(STORE_NAME, () => {
	const activeComment = ref(null)
	const currentUser = ref({
		image: {
			png: 'images/avatars/image-juliusomo.png',
			webp: 'images/avatars/image-juliusomo.webp',
		},
		username: 'juliusomo',
	})

	const comments = ref(getComments())

	function incrementScore(parentId, id) {
		if (!parentId) {
			const comment = comments.value.find(comment => comment.id === id)
			comment.score++
		} else {
			const replies = comments.value.find(comment => comment.id === parentId).replies
			const reply = replies.find(reply => reply.id === id)
			reply.score++
		}
	}

	function decrementScore(parentId, id) {
		if (!parentId) {
			const comment = comments.value.find(comment => comment.id === id)
			comment.score--
		} else {
			const replies = comments.value.find(comment => comment.id === parentId).replies
			const reply = replies.find(reply => reply.id === id)
			reply.score--
		}
	}

	function addComment(comment) {
		comments.value.push(comment)

		setLocalStorage(comments.value)
	}

	function addReply(parentId, id, newComment) {
		if (!parentId) {
			comments.value.map(comment => {
				if (comment.id === id) {
					comment.replies.push(newComment)
				}
			})
		} else {
			const replies = comments.value.find(comment => comment.id === parentId).replies
			replies.push(newComment)
		}

		setLocalStorage(comments.value)
	}

	function updateComment(parentId, id, updatedComment) {
		if (!parentId) {
			const comment = comments.value.find(comment => comment.id === id)
			comment.content = updatedComment
			comment.createdAt = Date.now()
		} else {
			const replies = comments.value.find(comment => comment.id === parentId).replies
			const reply = replies.find(reply => reply.id === id)
			reply.content = updatedComment
			reply.createdAt = Date.now()
		}

		activeComment.value = null
		setLocalStorage(comments.value)
	}

	function deleteComment(parentId, id) {
		if (!parentId) {
			comments.value = comments.value.filter(comment => comment.id !== id)
		} else {
			const undeletedReplies = comments.value
				.find(comment => comment.id === parentId)
				.replies.filter(reply => reply.id !== id)

			const comment = comments.value.find(comment => comment.id === parentId)
			comment.replies = undeletedReplies

			setLocalStorage(comments.value)
		}
	}

	const setActiveComment = (id, type) => {
		activeComment.value = { id, type }
	}

	return {
		activeComment,
		setActiveComment,
		currentUser,
		comments,
		incrementScore,
		decrementScore,
		addComment,
		addReply,
		updateComment,
		deleteComment,
	}
})
